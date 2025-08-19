import pool from '../../utils/db.js'
import {spawn} from 'child_process';

const languageConfig = {
    c: {
        containerName: 'gcc',
        fileName: 'main.c',
        compileCommand: 'gcc /tmp/main.c -o /tmp/main',
        runCommand: '/tmp/main'
    },
    cpp: {
        containerName: 'gcc',
        fileName: 'main.cpp',
        compileCommand: 'g++ /tmp/main.cpp -o /tmp/main',
        runCommand: '/tmp/main'
    },
    java: {
        containerName: 'java',
        fileName: 'Main.java',
        compileCommand: 'javac /tmp/Main.java',
        runCommand: 'java -cp /tmp Main'
    },
    javascript: {
        containerName: 'javascript',
        fileName: 'main.js',
        compileCommand: '',
        runCommand: 'node /tmp/main.js'
    },
    python: {
        containerName: 'python',
        fileName: 'main.py',
        compileCommand: '',
        runCommand: 'python3 /tmp/main.py'
    }
};


const executeInDocker = async (containerName, command, stdinData, timeoutMs) => {
    return new Promise((resolve, reject) => {
        const dockerArgs = ['exec', '-i', containerName, 'sh', '-c', command];
        const child = spawn('docker', dockerArgs);

        let stdout = '';
        let stderr = '';
        let killedByTimeout = false;

        const timer = setTimeout(() => {
            killedByTimeout = true;
            child.kill('SIGKILL');
        }, timeoutMs);

        child.stdout.on('data', (data) => stdout += data.toString());
        child.stderr.on('data', (data) => stderr += data.toString());

        child.on('close', (codeExit) => {
            clearTimeout(timer);

            if (killedByTimeout) {
                return reject({ error: 'Time Limit Exceeded' });
            }

            if (codeExit === 137) {
                return reject({ error: 'Memory Limit Exceeded' });
            }

            if (codeExit === 0) {
                return resolve(stdout);
            } else {
                return reject({ error: 'Runtime Error', details: stderr || `Exited with code ${codeExit}` });
            }
        });

        if (stdinData) child.stdin.write(stdinData);
        child.stdin.end();
    });
};

const executeCode = async (language, code, testCases) => {
    const { containerName, fileName, compileCommand, runCommand } = languageConfig[language];
    const containerFilePath = `/tmp/${fileName}`;

    const results = [];

    try {
        if (compileCommand) {
            // Compile once
            const compileCmd = `cat > ${containerFilePath} && ${compileCommand}`;
            await executeInDocker(containerName, compileCmd, code, 3000);
        } else {
            // For Python/JS - write file once
            const writeFileCmd = `cat > ${containerFilePath}`;
            await executeInDocker(containerName, writeFileCmd, code, 3000);
        }
    } catch (err) {
        results.push({ passed: false, error: 'Compilation failed', details: err.details || err.error });
        return results;
    }

    // Run test cases (no recompilation)
    for (const testCase of testCases) {
        try {
            const stdout = await executeInDocker(containerName, runCommand, testCase.input, 3000);
            const actualOutput = stdout.trim();
            const expectedOutput = testCase.expectedOutput.trim();

            results.push({
                actualOutput,
                expectedOutput,
                passed: actualOutput === expectedOutput
            });
        } catch (error) {
            results.push({
                passed: false,
                error: error.error || 'Runtime Error',
                details: error.details || ''
            });
        }
    }

    return results;
};

const runCode = async (req, res) => {
  const { problemId, language, code } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get test cases for the problem
    const { rows: testCasesData } = await client.query(
      `SELECT id, input, expected_output, points from test_cases where problem_id = $1`,
      [problemId]
    );

    if (testCasesData.length === 0) {
      return res
        .status(404)
        .json({ error: "No test cases found for this problem" });
    }

    const testCases = testCasesData.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expected_output,
      points: tc.points,
    }));

    // Execute code against all test cases
    const executionResults = await executeCode(language, code, testCases);

    let totalPoints = 0;

    executionResults.forEach((result, index) => {
      if (result.passed) {
        totalPoints += testCases[index].points;
      }
    });

    // Check for existing submissions
    const { rows: existingSubmissions } = await client.query(
      `SELECT id, points from submissions where user_id = $1 AND problem_id = $2`,
      [userId, problemId]
    );

    // Insert or update submission
    let submissionId;
    if (existingSubmissions.length > 0) {
      // Update existing submission
      const { rows } = await client.query(
        `UPDATE submissions 
                SET code = $1, points = $2, submission_time = current_timestamp
                WHERE user_id = $3 AND problem_id = $4
                RETURNING id`,
        [code, totalPoints, userId, problemId]
      );
      submissionId = rows[0].id;

      // Delete existing submission results
      await client.query(
        `DELETE FROM submission_results WHERE user_id = $1 AND test_case_id IN (
                    SELECT id FROM test_cases WHERE problem_id = $2
                )`,
        [userId, problemId]
      );
    } else {
      // Insert new submission
      const { rows } = await client.query(
        `INSERT INTO submissions
                (user_id, problem_id, code, points)
                VALUES
                ($1, $2, $3, $4)
                RETURNING id`,
        [userId, problemId, code, totalPoints]
      );
      submissionId = rows[0].id;
    }

    // Insert submission results
    await Promise.all(
      executionResults.map((result, index) =>
        client.query(
          `INSERT INTO submission_results (user_id, test_case_id, passed)
                    VALUES ($1, $2, $3)`,
          [userId, testCases[index].id, result.passed]
        )
      )
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Submission successful",
      points: totalPoints,
      results: executionResults,
      submissionId: submissionId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Submission error:", error);
    return res.status(500).json({ error: "Internal server Error" });
  } finally {
    client.release();
  }
};

export default runCode;
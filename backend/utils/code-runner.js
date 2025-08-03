const { spawn } = require('child_process');

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

// Executes Docker command with TLE & MLE detection (async/await)
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

// Main Runner (async/await only)
const run = async () => {
    const language = 'javascript';
    const code = `
        console.log("3");
    `;
    const testCases = [
        { input: '1 2', expectedOutput: '3' },
        { input: '2\n3', expectedOutput: '5' }
    ];

    const results = await executeCode(language, code, testCases);
    console.log(results);
};

// run();

module.exports = executeCode;
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

function executeInDocker (containerName, command, stdin) {
    
    return new Promise ((resolve, reject) => {

        const dockerArgs = ['exec', '-i', containerName, 'sh', '-c', command];
        const child = spawn ('docker', dockerArgs);

        let stdout = '';
        let stderr = '';
        let killedByTimeout = false;

        const timer = setTimeout (() => {
            killedByTimeout = true;
            child.kill('SIGKILL');
        }, (6000));

        child.stdout.on ('data', (data) => (stdout += data.toString()));
        child.stderr.on ('data', (data) => (stderr += data.toString()));

        if (stdin) child.stdin.write(stdin);
        child.stdin.end();

        child.on ('close', (exitCode) => {
            clearTimeout (timer);

            if (killedByTimeout)
                return reject ({error: 'Time Limit exceeded'});

            if (exitCode === 137)
                return reject ({error: 'Memory Limit exceeded'});

            if (exitCode === 0)
                return resolve (stdout);

            return reject ({
                error: 'Runtime Error',
                exitCode: exitCode,
                details: stderr
            });
        });

        child.on ('error', (error) => {
            clearTimeout (timer);
            return reject ({
                error: 'Process error',
                details: error.message || ''
            });
        });
    });
}

const executeCode = async (language, code, testCases) => {
    
    const {containerName, fileName, compileCommand, runCommand} = languageConfig[language];
    const containerFilePath = `/tmp/${fileName}`;
    const results = [];

    try {
        let command;

        if (compileCommand) command = `cat > ${containerFilePath} && ${compileCommand}`;
        else command = `cat > ${containerFilePath}`;

        await executeInDocker (containerName, command, code);
    }

    catch (error) {

        return testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expected_output,
            actualOutput: '',
            passed: false,
            error: error.details || error.error
        }));
    }

    for (const testCase of testCases) {
        try {
            const stdout = await executeInDocker (containerName, runCommand, testCase.input);
            const actualOutput = stdout.trim();

            results.push ({
                input: testCase.input,
                expectedOutput: testCase.expected_output.trim(),
                actualOutput,
                passed: actualOutput === testCase.expected_output.trim(),
            });
        }

        catch (error) {
            results.push ({
                input: testCase.input,
                expectedOutput: testCase.expected_output.trim(),
                actualOutput: '',
                passed: false,
                error: error.error || 'Runtime Error',
                details: error.details || ''
            });
        }
    }

    return results;
};

export default executeCode;
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { execFile as execFileCb } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import LANGUAGE_CONFIG from './language-config.js';

const execFile = promisify (execFileCb);

const RUNNER_SCRIPT = path.resolve('./run-in-bwrap.sh');
const JOB_TIMEOUT_MS = 3000;

export default async function executeCode (language, code, testCases) {

    const config = LANGUAGE_CONFIG [language];

    if (!config)
        throw new Error (`Unsupported Language: ${language}`);

    const jobDir = await mkdtemp (path.join(tmpdir(), 'job-'));

    try {
        const sourceName = `${config.fileName}`;
        const sourceHostPath = path.join(jobDir, sourceName);
        await writeFile (sourceHostPath, code, 'utf-8');

        let executableHostPath = sourceHostPath;
        const results = [];

        if (config.compileCommand) {
            const outputFile = path.join (jobDir, 'program');

            try {
                await execFile ('bash', ['-c', config.compileCommand (sourceHostPath, outputFile)], {
                    timeout: 6000,
                    maxBuffer: 10 * 1024 * 1024
                });

                executableHostPath = outputFile;
            }

            catch (compileError) {

                for (const tc of testCases) {
                    results.push ({
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: null,
                        passed: false,
                        error: compileError.stderr || compileError.stdout || compileError.message
                    });
                }
                return results;
            }
        }

        const fileName = path.basename(executableHostPath);
        const runCommand = config.runCommand (fileName);

        for (const tc of testCases) {
            await writeFile (path.join (jobDir, 'input.txt'), tc.input, 'utf-8');

            try {
                const { stdout } = await execFile (RUNNER_SCRIPT, [jobDir, runCommand], {
                    timeout: JOB_TIMEOUT_MS,
                    maxBuffer: 10 * 1024 * 1024,
                });

                results.push ({
                    id: tc.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    actualOutput: stdout.trim(),
                    passed: tc.expectedOutput.trim() === stdout.trim() ? true : false,
                    error: null
                });
            }

            catch (error) {
                const isTimeout = error.killed || error.signal === 'SIGTERM';

                results.push ({
                    id: tc.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    actualOutput: null,
                    passed: false,
                    error: isTimeout ? 'TLE' : (error.stderr || error.message).trim()
                });
            }
        }

        return results;
    }

    finally {
        await rm (jobDir, {recursive: true, force: true})
            .catch (() => {});
    }
}
import getRabbitMQChannel from './get-rabbitmq-channel.js';
import getShardDBPool from './get-db-pool.js';
import executeCode from './execute-code.js';

(async () => {
    const channel = await getRabbitMQChannel();

    channel.consume ('execution_queue', async (message) => {
        if (message !== null) {

            const {userId, contestCode, problemId, type, language, code} = JSON.parse(message.content.toString());

            const pool = getShardDBPool(contestCode);

            let results, priority;

            if (type === 'run') {
				priority = 1;

                const {rows: testCases} = await pool.query (`SELECT id, input, expected_output as "expectedOutput" FROM test_cases WHERE problem_id = $1 AND is_sample = true`, [problemId]);

                results = await executeCode (language, code, testCases);
                console.log(results);
            }
                
            else {
				priority = 2;

                const {rows: testCases} = await pool.query (`SELECT id, input, expected_output as "expectedOutput" FROM test_cases WHERE problem_id = $1 AND is_sample = false`, [problemId]);

                results = await executeCode (language, code, testCases);
            }

			const messageBuffer = Buffer.from (JSON.stringify({userId, contestCode, problemId, type, language, code, results}));
        	channel.sendToQueue('results_queue', messageBuffer, {persistent: true, priority});
        	await channel.waitForConfirms();
            
            channel.ack(message);
        }
    });
})();
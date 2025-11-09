import getRabbitMQChannel from '../../utils/get-rabbitmq-channel.js';

const submitCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const {contestCode, problemId} = req.params;
        const {language, code} = req.body;

        const message = { userId, contestCode, problemId, type: 'submit', language, code };
        const messageBuffer = Buffer.from (JSON.stringify(message));

        const channel = await getRabbitMQChannel();
        channel.sendToQueue('execution_queue', messageBuffer, {persistent: true, priority: 2});
        
        await channel.waitForConfirms();

        res.status(202).json({webSocketId: `${req.user.id}-${contestCode}-${problemId}`});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default submitCode;

/*
import {getShardDBPool} from '../../utils/get-db-pool.js';
import executeCode from '../../utils/execute-code.js';

const submitCode = (io) => async (req, res) => {

    const client = await pool.connect();
    const {contestId, problemId} = req.params;

    const {language, code} = req.body;
    const userId = req.user.id;

    try {
        await client.query('BEGIN');

        const insertResult = await client.query (`INSERT INTO submissions (user_id, problem_id, language, code) VALUES ($1, $2, $3, $4) RETURNING id`, [userId, problemId, language, code]);

        const submissionId = insertResult.rows[0].id;

        const {rows: testCases} = await client.query (`
            SELECT id, input, expected_output, points from test_cases where problem_id = $1`,
            [problemId]
        );

        const results = await executeCode (language, code, testCases);

        if (results.length > 0)
        {
            const values = [];
            const placeholders = [];

            results.forEach ((result, index) => {

                const placeholderStart = index * 3 + 1;
                placeholders.push(`($${placeholderStart}, $${placeholderStart + 1}, $${placeholderStart + 2})`);

                values.push (submissionId, testCases[index].id, result.passed);
            });

            await client.query (`INSERT INTO submission_results (submission_id, test_case_id, passed) VALUES ${placeholders.join(', ')}`, values);
        }

        await client.query (`CALL update_leaderboards_procedure ($1)`, [submissionId]);
		await client.query('COMMIT');

		res.status(201).json(results);
		        
        const {rows: updatedLeaderboard} = await client.query (
			`SELECT u.username, l.total_points, l.total_submissions
			FROM leaderboards l
			JOIN users u ON u.id = l.user_id
			WHERE l.contest_id = $1
			ORDER BY l.total_points DESC, l.total_submissions ASC`,
			[contestId]
        );

		io.emit (`leaderboard-update-${contestId}`, updatedLeaderboard);
    }

    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default submitCode;
*/
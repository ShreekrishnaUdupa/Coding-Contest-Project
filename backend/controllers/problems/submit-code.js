import pool from '../../utils/db.js';
import executeCode from '../../utils/execute-code.js';

const submitCode = (io) => async (req, res) => {

    const client = await pool.connect();
    const {contestId, problemId} = req.params;

    const {language, code} = req.body;
    const userId = req.user.id;

    try {
        await client.query('BEGIN');

        const insertResult = await client.query (`INSERT INTO submissions (user_id, problem_id, language, code) VALUES ($1, $2, $3, $4) RETURNING ID`, [userId, problemId, language, code]);

        const submissionId = insertResult.rows[0].id;

        const {rows: testCases} = await client.query (`
            SELECT id, input, expected_output, points from test_cases where problem_id = $1`,
            [problemId]
        );

        const results = await executeCode (language, code, testCases);

        const insertPromises = results.map ((value, index) => {
            return client.query (
                `INSERT INTO submission_results (submission_id, test_case_id, passed) VALUES ($1, $2, $3)`,
                [submissionId, testCases[index].id, value.passed]
            )
        });

        await Promise.all(insertPromises);

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
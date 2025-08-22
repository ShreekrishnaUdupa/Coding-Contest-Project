import pool from '../../utils/db.js';
import executeCode from '../../utils/execute-code.js';

const submitCode = async (req, res) => {

    const client = await pool.connect();

    const {problemId, language, code} = req.body;
    const userId = req.user.id;

    try {
        await client.query('BEGIN');

        const insertResult = await client.query (`INSERT INTO submissions (user_id, problem_id, code) VALUES ($1, $2, $3) RETURNING ID`, [userId, problemId, code]);

        const submissionId = insertResult.rows[0].id;

        const {rows: testCases} = await client.query (`
            SELECT id, input, expected_output, points from test_cases where problem_id = $1`,
            [problemId]
        );

        const results = await executeCode (language, code, testCases);

        const values = results.map ((value, index) =>
            `(${submissionId}, ${testCases[index].id}, ${value.passed})`
        ).join(',');

        await client.query (`INSERT INTO submission_results (submission_id, test_case_id, passed) VALUES ${values}`);
        
        await client.query('COMMIT');

        return res.status(201).json(results);
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
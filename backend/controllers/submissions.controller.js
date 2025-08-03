const pool = require ('../utils/db');
const executeCode = require ('../utils.code-runner');

const runCode = async (req, res) => {
    
    const {problemId, language, code} = req.body;
    const userId = req.user.id;
    const client = await pool.connect ();

    try {
        await client.query ('BEGIN');

        const results = client.query (`SELECT id, input, expected_output, points from test_cases where problem_id = $1`, [problemId]);

        const testCases = results.rows;

        testCases = testCases.map (tc => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expected_output,
            points: tc.input
        }));

        const executionResults = await executeCode (language, code, testCases);

        let totalPoints = 0;
        
        executionResults.forEach((result, index) => {
            if (result.passed)
                totalPoints += testCases[index].points;
        });

        const submissionInsert = await client.query (
            `INSERT INTO submissions
            (user_id, problem_id, code, points)
            VALUES
            ($1, $2, $3, $4)
            RETURNING id`,
            [userId, problemId, code, totalPoints]
        );

        const submissionId = submissionInsert.rows[0].id;

        await Promise.all(
            executionResults.map((result, index) =>
                client.query(
                    `INSERT INTO submission_results (user_id, test_case_id, passed)
                    VALUES ($1, $2, $3)`,
                    [result.user_id, testCases[index].id, result.passed]
                )
            )
        );

        await client.query('COMMIT');

        return res.status(200).json({
            message: 'Submission successful',
            points: totalPoints,
        });
    }

    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        return res.status(500).json({error: 'Internal server Error'});
    }

    finally {
        client.release();
    }
};

module.exports = {runCode};
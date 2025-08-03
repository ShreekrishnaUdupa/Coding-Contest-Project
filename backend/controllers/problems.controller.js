const pool = require ('../utils/db');

const createProblem = async (req, res) => {

    const {contestId, difficulty, title, statement, constraints, testCases} = req.body;
    const client = pool.connect ();

    try {

        await client.query ('BEGIN');

        const result = await client.query (`INSERT INTO problems (contest_id, difficulty, title, statement, constraints) VALUES ($1, $2, $3, $4, $5) RETURNING ID`, [contestId, difficulty, title, statement, constraints]);

        const problemId = result[0].id;

        const testCaseValues = testCases.map (tc => `(${problemId}, ${tc.input}, ${tc.expectedOutput}, ${tc.points}, ${tc.isSample})`).join(',');

        await client.query (`INSERT INTO test_cases (problem_id, input, expectezd_output, points, is_sample) VALUES ${testCaseValues}`);

        await client.query ('COMMIT');

        return res.status(201).end();
    }
    
    catch (error) {
        await client.query ('ROLLBACK');
        console.log('Error happened in createProblem', error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        await client.release();
    }


};

module.exports = {createProblem};
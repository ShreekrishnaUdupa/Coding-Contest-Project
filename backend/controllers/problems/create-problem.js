import pool from '../../utils/db.js';

const createProblem = async (req, res) => {

    const {contestId, number, title, difficulty, statement, inputFormat, outputFormat, constraints, testCases} = req.body;
    let client;

    try {
        client = await pool.connect();
        await client.query ('BEGIN');

        const result = await client.query (`
            INSERT INTO problems (contest_id, number, title, difficulty, statement, input_format, output_format, constraints)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
            [contestId, number, title, difficulty, statement, inputFormat, outputFormat, constraints]
        );

        const problemId = result.rows[0].id;

        let testCasesValues = testCases.map (tc =>
            `(${problemId}, '${tc.input}', '${tc.expectedOutput}', ${tc.points}, ${tc.isSample})`
        ).join(',');

        testCasesValues += ';';

        await client.query (`INSERT INTO test_cases (problem_id, input, expected_output, points, is_sample) VALUES ${testCasesValues}`);

        await client.query ('COMMIT');

        return res.status(201).end();
    }
    
    catch (error) {
        await client.query ('ROLLBACK');
        console.error('Error happened in createProblem', error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default createProblem;
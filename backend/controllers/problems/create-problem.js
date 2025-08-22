import pool from '../../utils/db.js';

const createProblem = async (req, res) => {

    const {contestId, title, difficulty, statement, constraints, testCases} = req.body;
    let client;

    try {
        client = await pool.connect();
        await client.query ('BEGIN');

        const result = await client.query (`
            INSERT INTO problems (contest_id, title, difficulty, statement, constraints)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (contest_id, title)
            DO UPDATE SET difficulty = EXCLUDED.difficulty,
                          statement = EXCLUDED.statement,
                          constraints = EXCLUDED.constraints
            RETURNING id`,
            [contestId, title, difficulty, statement, constraints]
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
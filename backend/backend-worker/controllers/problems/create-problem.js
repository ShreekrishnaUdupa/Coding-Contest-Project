import {getShardDBPool} from '../../utils/get-db-pool.js';
import getRedisClient from '../../utils/get-redis-client.js';

const createProblem = async (req, res) => {

    const contestCode = req.params.contestCode;
    const {title, difficulty, statement, constraints, testCases} = req.body;
    const pool = getShardDBPool(contestCode);
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');

        const result = await client.query (`
            INSERT INTO problems (contest_code, title, difficulty, statement, constraints)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
            [contestCode, title, difficulty, statement, constraints]
        );

        const problemId = result.rows[0].id;

        let testCasesValues = testCases.map (tc =>
            `(${problemId}, '${tc.input}', '${tc.expectedOutput}', ${tc.points}, ${tc.isSample})`
        ).join(',');

        testCasesValues += ';';

        await client.query (`INSERT INTO test_cases (problem_id, input, expected_output, points, is_sample) VALUES ${testCasesValues}`);

        await client.query ('COMMIT');

        res.status(201).end();

        const redisClient = await getRedisClient();

        const {rows: allProblems} = await client.query (`SELECT id, title, difficulty, total_points FROM problems WHERE contest_code = $1`, [contestCode]);

        redisClient.set (`${contestCode}-problems`, JSON.stringify(allProblems));
    }
    
    catch (error) {
        await client.query ('ROLLBACK');
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default createProblem;
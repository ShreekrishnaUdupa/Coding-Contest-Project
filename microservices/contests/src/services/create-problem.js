import getShardDBPool from '../utils/get-db-pool.js';
import getRedisClient from '../config/redis.js';

export default async function createProblemService ({contestCode, title, difficulty, statement, constraints, testCases}) {

    const pool = getShardDBPool (contestCode);
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
    }

    catch (error) {

    }
}
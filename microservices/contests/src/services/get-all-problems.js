import getShardDBPool from '../utils/get-db-pool.js';
import getRedisClient from '../config/redis.js';

export default async function getAllProblemsService ({contestCode}) {

    const pool = getShardDBPool (contestCode);

    const redisClient = await getRedisClient();
    const data = await redisClient.get(`${contestCode}-problems`);

    if (data)
        return JSON.parse (data);

    const results  = await pool.query (`SELECT id, title, difficulty, total_points as "totalPoints" FROM problems WHERE contest_code = $1`, [contestCode]);

    const problems = results.rows;

    redisClient.set (`${contestCode}-problems`, JSON.stringify(problems));

    return problems;
}
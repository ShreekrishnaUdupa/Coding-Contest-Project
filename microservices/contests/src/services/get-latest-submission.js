import getShardDBPool from '../utils/get-db-pool.js';

export default async function getLatestSubmissionService ({userId, contestCode, problemId}) {

    const pool = getShardDBPool(contestCode);

    const results = await pool.query (`SELECT language, code FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC LIMIT 1`, [userId, problemId]);

    return results;
}
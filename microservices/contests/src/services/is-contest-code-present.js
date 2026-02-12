import getShardDBPool from '../utils/get-db-pool.js';

export default async function isContestCodePresent (contestCode) {

    const pool = getShardDBPool (contestCode);

    const results = await pool.query (`SELECT code FROM contests WHERE code = $1`, [contestCode]);

    return results.rowCount == 0;
}
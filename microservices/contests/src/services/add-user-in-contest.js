import getShardDBPool from '../utils/get-db-pool.js';

export default async function addUserInContestService ({contestCode, userId, role}) {

    const pool = getShardDBPool (contestCode);

    await pool.query(`INSERT INTO contest_user_roles (contest_code, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (contest_code, user_id) DO NOTHING;`, [contestCode, userId, role]);
}
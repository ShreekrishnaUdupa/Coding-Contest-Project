import getShardDBPool from '../utils/get-db-pool.js';

export default async function createContestService ({code, title, description, rules, startTime, endTime, userId}) {

    const pool = getShardDBPool (code);
    const client = await pool.connect();

    try {
        await client.query (`BEGIN`);

        await client.query (`INSERT INTO contests (code, title, description, rules, start_time, end_time, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [code, title, description, rules, startTime, endTime, userId]);

        await client.query (`CREATE TABLE IF NOT EXISTS leaderboards_contest_${code.replace(/[^a-zA-Z0-9_]/g, '_')} PARTITION OF leaderboards FOR VALUES IN ('${code}');`);

        await client.query ('COMMIT');
    }

    catch (error) {
        await client.query ('ROLLBACK');
    }

    finally {
        client.release();
    }
}
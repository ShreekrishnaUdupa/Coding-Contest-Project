import getShardDBPool from '../utils/get-db-pool.js';

export default async function getContestDetailsService (contestCode) {

    const pool = getShardDBPool (contestCode);

    try {
        const results = await pool.query (`SELECT title, description, rules, start_time, end_time from contests where code = $1`, [contestCode]);

        if (results.rows.length === 0)
            return {isPresent: false};

        const {title, description, rules, start_time: startTime, end_time: endTime} = results.rows[0];

        return {isPresent: true, title, description, rules, startTime, endTime};
    }

    catch (error) {

    }
}
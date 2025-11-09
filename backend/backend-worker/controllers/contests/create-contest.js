import {getShardDBPool} from '../../utils/get-db-pool.js';

const createContest = async (req, res) => {

    const {code, title, description, rules, startTime, endTime} = req.body;
    const pool = getShardDBPool(code);
    const client = await pool.connect();
    
    try {
        await client.query ('BEGIN');
    
        const results = await client.query ('SELECT code FROM contests WHERE code = $1', [code]);
    
        if (results.rowCount !== 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({error: 'Contest Code already exists, please choose a different one'});
        }
    
        await client.query (`INSERT INTO contests (code, title, description, rules, start_time, end_time, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7);`, [code, title, description, rules, startTime, endTime, req.user.id]);

        await client.query ('COMMIT');

        res.status(201).end();

        client.query (`CREATE TABLE IF NOT EXISTS leaderboards_contest_${code.replace(/[^a-zA-Z0-9_]/g, '_')} PARTITION OF leaderboards FOR VALUES IN ('${code}');`);
    }
    
    catch (error) {
        await client.query ('ROLLBACK');
        console.error('Error in createContest', error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default createContest;
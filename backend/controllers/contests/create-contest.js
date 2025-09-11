import pool from '../../utils/db.js';

const createContest = async (req, res) => {

    const {code, title, description, rules, startTime, endTime} = req.body;
    let client;
    
    try {

        client = await pool.connect ();
        await client.query ('BEGIN');
    
        const results = await client.query ('SELECT code FROM contests WHERE code = $1', [code]);
    
        if (results.rowCount !== 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({error: 'Contest Code already exists, please choose a different one'});
        }
    
        const insertContestResult = await client.query (`INSERT INTO contests (code, title, description, rules, start_time, end_time, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID`, [code, title, description, rules, startTime, endTime, req.user.id]);

        const contestId = insertContestResult.rows[0].id;

        await client.query ('COMMIT');

        res.status(201).json({contestId});

        client.query (`CREATE TABLE IF NOT EXISTS leaderboards_contest_${contestId} PARTITION OF leaderboards FOR VALUES IN (${contestId});`);
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
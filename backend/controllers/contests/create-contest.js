import pool from '../../utils/db.js';

const createContest = async (req, res) => {

    const {name, title, description, rules, startTime, endTime} = req.body;
    let client;
    
    try {

        client = await pool.connect ();
        await client.query ('BEGIN');
    
        const results = await client.query ('SELECT name FROM contests WHERE name = $1', [name]);
    
        if (results.rowCount !== 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({error: 'Contest Name already exists, please choose a different one'});
        }
    
        const insertContestResult = await client.query (`INSERT INTO contests (name, title, description, rules, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID`, [name, title, description, rules, startTime, endTime]);

        const contestId = insertContestResult.rows[0].id;

        await client.query (`CALL insert_organizer_in_contest_user_roles ($1, $2);`, [req.user.id, contestId]);

        await client.query ('COMMIT');

        res.status(201).end();

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
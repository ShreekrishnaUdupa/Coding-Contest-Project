const pool = require ('../utils/db');

const createContest = async (req, res) => {

    const client = await pool.connect ();
    
    try {
        const {name, title, description, rules, startTime, endTime} = req.body;

        await client.query ('BEGIN');
    
        const results = await client.query ('SELECT name FROM contests WHERE name = $1', [name]);
    
        if (results.rowCount !== 0)
            return res.status(409).json({error: 'Contest Name already exists, please choose a different one'});
    
        await client.query (`INSERT INTO contests (name, title, description, rules, start_time, end_time, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [name, title, description, rules, startTime, endTime, req.user.id]);

        await client.query ('COMMIT');

        return res.status(201).end();
    }
    
    catch (error) {
        await client.query ('ROLLBACK');
        console.log('Error in createContest', error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

module.exports = {createContest};
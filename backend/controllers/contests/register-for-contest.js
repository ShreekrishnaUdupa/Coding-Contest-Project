import pool from '../../utils/db.js';

const registerForContest = async (req, res) => {

    const client = await pool.connect();
    const {contestId} = req.body;
    const userId = req.user.id;

    try {
        await client.query('BEGIN');

        await client.query('INSERT INTO contest_user_roles (contest_id, user_id) VALUES ($1, $2);', [contestId, userId]);

        await client.query('COMMIT');

        return res.status(201).end();
    }

    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default registerForContest;
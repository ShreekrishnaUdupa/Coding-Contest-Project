import pool from '../../utils/db.js';

const registerForContest = async (req, res) => {

    try {
        const {contestId} = req.body;
        const userId = req.user.id;

        console.log(contestId);
        console.log(userId);

        await pool.query('INSERT INTO contest_user_roles (contest_id, user_id) VALUES ($1, $2) ON CONFLICT (contest_id, user_id) DO NOTHING;', [contestId, userId]);

        return res.status(201).end();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default registerForContest;
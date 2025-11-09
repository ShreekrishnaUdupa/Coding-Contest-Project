import {getShardDBPool} from '../../utils/get-db-pool.js';

const registerForContest = async (req, res) => {
    try {
        const {contestCode} = req.params;
        const userId = req.user.id;
        const pool = getShardDBPool(contestCode);

        await pool.query('INSERT INTO contest_user_roles (contest_code, user_id) VALUES ($1, $2) ON CONFLICT (contest_code, user_id) DO NOTHING;', [contestCode, userId]);

        res.status(201).end();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default registerForContest;
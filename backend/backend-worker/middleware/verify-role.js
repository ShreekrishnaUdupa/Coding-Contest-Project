import {getShardDBPool} from '../utils/get-db-pool.js';

const verifyRole = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contestCode = req.params.contestCode;
        const pool = getShardDBPool(contestCode);

        const results = await pool.query (`Select role from contest_user_roles where user_id = $1 AND contest_code = $2`, [userId, contestCode]);

        if (results.rows.length === 0)
            return res.status(401).json({error: 'Unauthorized access'});

        req.user.role = results.rows[0].role;

        next ();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default verifyRole;
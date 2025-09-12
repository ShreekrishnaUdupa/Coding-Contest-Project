import pool from '../utils/db.js';

const verifyRole = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let contestId;

        if (req.body.contestId) contestId = req.body.contestId;
        else contestId = req.params.contestId;

        const results = await pool.query (`Select role from contest_user_roles where user_id = $1 AND contest_id = $2`, [userId, contestId]);

        const role = results.rows[0].role;

        if (!role)
            return res.status(401).json({error: 'Unauthorized access'});

        next ();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default verifyRole;
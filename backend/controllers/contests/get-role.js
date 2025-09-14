import pool from '../../utils/db.js';

const getRole = async (req, res) => {

    const {contestId} = req.params;

    try {
        const results = await pool.query (`SELECT role from contest_user_roles WHERE user_id = $1 AND contest_id = $2`, [req.user.id, contestId]);

        const role = results.rows[0].role;

        return res.status(200)
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getRole;
import {getShardDBPool} from '../../utils/get-db-pool.js';

const getRole = async (req, res) => {

    const {contestCode} = req.params;
    const pool = getShardDBPool(contestCode);

    try {
        const results = await pool.query (`SELECT role from contest_user_roles WHERE user_id = $1 AND contest_code = $2`, [req.user.id, contestCode]);

        const role = results.rows[0].role;

        return res.status(200)
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getRole;
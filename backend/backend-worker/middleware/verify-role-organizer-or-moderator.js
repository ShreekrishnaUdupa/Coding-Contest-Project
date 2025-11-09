import {getShardDBPool} from '../utils/get-db-pool.js';

const verifyRoleOrganizerOrModerator = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contestCode = req.params.contestCode;
        const pool = getShardDBPool(contestCode);

        const results = await pool.query (`SELECT role FROM contest_user_roles WHERE user_id = $1 AND contest_code = $2`, [userId, contestCode]);

        const role = results.rows[0].role;

        if (role != 'organizer' && role != 'moderator')
            return res.status(401).json({error: 'Unauthorized access'});

        next ();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default verifyRoleOrganizerOrModerator;
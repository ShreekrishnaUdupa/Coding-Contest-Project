import pool from '../utils/db.js';

const verifyRoleOrganizerOrModerator = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const results = await pool.query (`Select role from contest_user_roles where user_id = $1`, [userId]);

        const role = results.rows[0].role;

        console.log(userId);
        console.log(role);

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
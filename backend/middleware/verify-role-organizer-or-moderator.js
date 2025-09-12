import pool from '../utils/db.js';

const verifyRoleOrganizerOrModerator = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let contestId;

        if (req.body.contestId) contestId = req.body.contestId;
        else contestId = req.params.contestId;

        const results = await pool.query (`SELECT role FROM contest_user_roles WHERE user_id = $1 AND contest_id = $2`, [userId, contestId]);

        console.log(results);

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
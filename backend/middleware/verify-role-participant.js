import pool from '../utils/db.js';

const verifyRoleParticipant = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contestId = req.params.contestId;
                
        const results = await pool.query (`SELECT role FROM contest_user_roles WHERE user_id = $1 AND contest_id = $2`, [userId, contestId]);

        const role = results.rows[0].role;
        
        if (role != 'participant')
            return res.status(401).json({error: 'Unauthorized access'});

        next ();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default verifyRoleParticipant;
import pool from '../utils/db.js';

const verifyParticipant = async (req, res, next) => {
    
    const userId = req.user.id;

    try {
        const results = await pool.query (`Select role from contest_user_roles where user_id = $1`, [userId]);

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

export default verifyParticipant;
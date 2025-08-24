import pool from '../../utils/db.js';

const getLatestCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const {problemId} = req.query;

        const results = await pool.query (`SELECT language, code FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC LIMIT 1`, [userId, problemId]);

        return res.status(200).json({language: results.rows[0].language, code: results.rows[0].code});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getLatestCode;
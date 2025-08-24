import pool from '../../utils/db.js';

const getSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const {problemId} = req.params;

        const results = await pool.query (`SELECT id, points, total_points, test_cases_passed, total_test_cases FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC`, [userId, problemId]);

        return res.status(200).json(results.rows);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getSubmissions;
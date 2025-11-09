import {getShardDBPool} from '../../utils/get-db-pool.js';

const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const {contestCode, problemId} = req.params;
        const pool = getShardDBPool(contestCode);

        const results = await pool.query (`SELECT id, points_scored as "pointsScored", total_points as "totalPoints", test_cases_passed as "testCasesPassed", total_test_cases as "totalTestCases" FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC`, [userId, problemId]);

        return res.status(200).json(results.rows);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getAllSubmissions;
import getShardDBPool from '../utils/get-db-pool.js';

export default async function getAllSubmissionsService ({contestCode, problemId, userId}) {

    const pool = getShardDBPool(contestCode);

    try {
        const results = await pool.query (`SELECT id, points_scored as "pointsScored", total_points as "totalPoints", test_cases_passed as "testCasesPassed", total_test_cases as "totalTestCases" FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC`, [userId, problemId]);

        return results.rows;
    }

    catch (error) {

    }
}
import getShardDBPool from '../utils/get-db-pool.js';

export default async function getProblemService ({contestCode, problemId}) {

    const pool = getShardDBPool (contestCode);

    try {
        const problemResult = await pool.query (`SELECT id, difficulty, title, statement, constraints, total_points FROM problems WHERE contest_code = $1 AND id = $2`, [contestCode, problemId]);

        const sampleTestCasesResult = await pool.query (`SELECT id, input, expected_output FROM test_cases WHERE problem_id = $1 AND is_sample = true`, [problemId]);

        const problem = problemResult.rows[0];
        problem.totalPoints = problem.total_points;
        delete problem.total_points;
        
        problem.sampleTestCases = sampleTestCasesResult.rows;

		return problem;
    }

    catch (error) {
        
    }
}
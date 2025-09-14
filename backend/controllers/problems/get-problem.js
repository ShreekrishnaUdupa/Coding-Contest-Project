import pool from '../../utils/db.js';

const getProblem = async (req, res) => {

	const {contestId, problemId} = req.params;
    const client = await pool.connect();

    try {
		const problemResult = await client.query (`SELECT id, difficulty, title, statement, constraints, total_points FROM problems WHERE contest_id = $1 AND id = $2`, [contestId, problemId]);

        const sampleTestCasesResult = await client.query (`SELECT id, input, expected_output FROM test_cases WHERE problem_id = $1 AND is_sample = true`, [problemId]);

        const problem = problemResult.rows[0];
        problem.totalPoints = problem.total_points;
        delete problem.total_points;
        
        problem.sampleTestCases = sampleTestCasesResult.rows;

		return res.status(200).json({role: req.user.role, problem});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getProblem;
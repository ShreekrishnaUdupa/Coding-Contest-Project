import pool from '../../utils/db.js';

const getSampleTestCases = async (req, res) => {
	try {
		const {problemId} = req.params;

		const result = await pool.query (`SELECT number, input, expected_output FROM test_cases WHERE problem_id = $1 AND is_sample = true ORDER BY number`, [problemId]);

		return res.status(200).json({testCases: result.rows});
	}

	catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}
};

export default getSampleTestCases;
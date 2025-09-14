import pool from '../../utils/db.js';

const getAllProblems = async (req, res) => {
	try {
		const contestId = req.params.contestId;

		const results  = await pool.query (`SELECT id, title, difficulty, total_points FROM problems WHERE contest_id = $1`, [contestId]);

		return res.status(200).json({role: req.user.role, problems: results.rows});
	}

	catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}
};

export default getAllProblems;
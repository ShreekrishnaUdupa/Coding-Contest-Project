import pool from '../../utils/db.js';

const getProblems = async (req, res) => {
	try {
		const {contestName} = req.query;

		const contestCheck = await pool.query (`SELECT id FROM contests where name = $1`, [contestName]);

		if (contestCheck.rows.length === 0)
			return res.status(404).json({error: 'No contest found with the given name'});

		const contestId = contestCheck.rows[0].id;

		const results = await pool.query (`SELECT id, difficulty, title, total_points FROM problems WHERE contest_id = $1`, [contestId]);

		console.log(results.rows);

		return res.status(200).json(results.rows);

	}

	catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}
};

export default getProblems;
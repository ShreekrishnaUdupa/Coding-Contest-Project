import pool from '../../utils/db.js';

const getProblem = async (req, res) => {
    try {
		const {problemId} = req.params;

        const result = await pool.query (`SELECT number, title, difficulty, statement, input_format, output_format, constraints FROM problems WHERE problem_id = $1`, [problemId]);

		return res.status(200).json({
			number: result.rows[0].number,
			title: result.rows[0].title,
			difficulty: result.rows[0].difficulty,
			statement: result.rows[0].statement,
			inputFormat: result.rows[0].input_format,
			outputFormat: result.rows[0].output_format,
			constraints: result.rows[0].constraints
		});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getProblem;
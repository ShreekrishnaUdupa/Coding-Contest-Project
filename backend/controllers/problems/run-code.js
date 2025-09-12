import pool from '../../utils/db.js';
import executeCode from '../../utils/execute-code.js';

const runCode = async (req, res) => {
    try {
        const {problemId} = req.params;
        const {language, code} = req.body;

        const testCasesResults = await pool.query (`SELECT input, expected_output FROM test_cases WHERE problem_id = $1 AND is_sample = true`, [problemId]);

        const testCases = testCasesResults.rows;

        const results = await executeCode (language, code, testCases);

        return res.status(200).json(results);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default runCode;
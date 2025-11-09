import {getShardDBPool} from '../../utils/get-db-pool.js';

const getLatestSubmission = async (req, res) => {
    try {
        const userId = req.user.id;
        const {contestCode, problemId} = req.params;
        const pool = getShardDBPool(contestCode);

        const results = await pool.query (`SELECT language, code FROM submissions WHERE user_id = $1 AND problem_id = $2 ORDER BY id DESC LIMIT 1`, [userId, problemId]);

        if (results.rows.length === 0)
            return res.status(204).end();

        return res.status(200).json(results.rows[0]);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getLatestSubmission;
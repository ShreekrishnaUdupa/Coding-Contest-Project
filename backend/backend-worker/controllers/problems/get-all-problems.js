import {getShardDBPool} from '../../utils/get-db-pool.js';
import getRedisClient from '../../utils/get-redis-client.js';

const getAllProblems = async (req, res) => {
	try {
		const contestCode = req.params.contestCode;
        const pool = getShardDBPool(contestCode);

        const redisClient = await getRedisClient();
        const data = await redisClient.get(`${contestCode}-problems`);

        if (data) {
            const parsedData = JSON.parse(data);
            return res.status(200).json({role: req.user.role, problems: parsedData});
        }

		const results  = await pool.query (`SELECT id, title, difficulty, total_points as "totalPoints" FROM problems WHERE contest_code = $1`, [contestCode]);

		res.status(200).json({role: req.user.role, problems: results.rows});

        await redisClient.set (`${contestCode}-problems`, JSON.stringify(results.rows));
	}

	catch (error) {
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}
};

export default getAllProblems;
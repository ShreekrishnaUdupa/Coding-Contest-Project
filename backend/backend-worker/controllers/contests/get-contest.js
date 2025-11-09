import {getShardDBPool} from '../../utils/get-db-pool.js';

const getContest = async (req, res) => {

    const {contestCode} = req.params;
    const pool = getShardDBPool(contestCode);

    try {
        const results = await pool.query (`SELECT code, title, description, rules, start_time, end_time from contests where code = $1`, [contestCode]);

        if (results.rows.length === 0)
          return res.status(404).json({error: 'Error 404, contest not found'});

        const {id, title, description, rules, start_time: startTime, end_time: endTime} = results.rows[0];

        return res.status(200).json({title, description, rules, startTime, endTime});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getContest;
import pool from '../../utils/db.js';

const getContest = async (req, res) => {

    const {contestName} = req.params;

    try {
        const results = await pool.query (`SELECT id, title, description, rules, start_time, end_time from contests where name = $1`, [contestName]);

        const {id, title, description, rules, start_time: startTime, end_time: endTime} = results.rows[0];

        return res.status(200).json({id, title, description, rules, startTime, endTime});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getContest;
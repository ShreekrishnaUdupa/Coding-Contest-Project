import pool from '../../utils.db.js';

const getContest = async (req, res) => {

    let client;

    try {
        client = await pool.connect();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default getContest;
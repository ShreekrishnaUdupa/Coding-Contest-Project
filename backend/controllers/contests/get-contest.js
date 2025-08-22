import pool from '../../utils.db.js';

const getContest = async (req, res) => {

    const client = await pool.connect();

    try {

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
import pool from '../../utils/db.js';

const getProblems = async (req, res) => {
    try {

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default getProblems;
import pool from '../../utils/db.js';

const runCode = async (req, res) => {
    try {
        const {problemId} = req.params;

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }

    finally {

    }
};

export default runCode;
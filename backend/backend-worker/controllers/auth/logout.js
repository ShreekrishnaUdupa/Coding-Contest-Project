import {getUsersDBPool} from '../../utils/get-db-pool.js';

const logout = async (req, res) => {

    const pool = getUsersDBPool();
    
    try {
        await pool.query (`UPDATE users SET refresh_token = NULL WHERE id = $1`, [req.user.id]);

        return res
                .status(200)
                .clearCookie ('accessToken', {path: '/'})
                .clearCookie ('refreshToken', {path: '/'})
                .end();
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default logout;
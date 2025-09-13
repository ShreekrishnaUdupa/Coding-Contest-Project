import pool from '../../utils/db.js';

const logout = async (req, res) => {
    try {
        await pool.query (`UPDATE users SET refresh_token = NULL WHERE id = $1`, [req.user.id]);

        return res
                .status(200)
                .clearCookie ('accessToken', {path: '/'})
                .clearCookie ('refreshToken', {path: '/'});
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default logout;
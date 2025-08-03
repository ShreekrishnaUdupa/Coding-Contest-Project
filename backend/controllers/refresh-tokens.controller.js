const jwt = require ('jsonwebtoken');
const pool = require ('../utils/db.js');
const generateJWTAndCookieOptions = require ('../utils/generate-jwt-and-cookie-options');

const refreshTokens = async (req, res) => {

    const client = await pool.connect ();

    try {
        const refreshToken = req.cookies.refreshToken || req.headers['authorization'].replace('Bearer', '').trim();

        if (!refreshToken)
            return res.status(401).json({error: 'Unauthorized access'});

        const {id} = jwt.verify (refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const result = await client.query (`Select refresh_token from users where id = $1`, [id]);

        if (result.rowCount === 0 || result.rows[0].refresh_token !== refreshToken)
            return res.status(401).json({error: 'Unauthorized access'});

        const {accessToken, refreshToken: newRefreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (id);

        await client.query (`update users set refresh_token = $1 where id = $2`, [newRefreshToken, id]);

        return res
            .status (201)
            .cookie ('accessToken', accessToken, accessTokenCookieOption)
            .cookie ('refreshToken', newRefreshToken, refreshTokenCookieOption)
            .json({accessToken, refreshToken: newRefreshToken})
    }

    catch (error) {
        console.error (error);
        return res.status(500).json({error: 'Internal Server error'});
    }

    finally {
        client.release();
    }
};

module.exports = {refreshTokens};
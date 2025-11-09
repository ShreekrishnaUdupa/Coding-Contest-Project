import jwt from 'jsonwebtoken';
import {getUsersDBPool} from '../../utils/get-db-pool.js';
import generateJWTAndCookieOptions from '../../utils/generate-jwt-and-cookie-options.js';

const generateNewTokens = async (req, res) => {

    const pool = getUsersDBPool();
    const client = await pool.connect ();

    try {
        const oldRefreshToken = req.cookies.refreshToken || req.headers['authorization'].replace('Bearer ', '').trim();

        if (!oldRefreshToken)
            return res.status(401).json({error: 'Unauthorized access'});

        const {id} = jwt.verify (oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const result = await client.query (`Select refresh_token from users where id = $1`, [id]);

        if (result.rowCount === 0 || result.rows[0].refresh_token !== oldRefreshToken)
            return res.status(401).json({error: 'Unauthorized access'});

        const {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (id);

        await client.query (`update users set refresh_token = $1 where id = $2`, [refreshToken, id]);

        return res
            .status (201)
            .clearCookie ('accessToken', {path: '/'})
            .clearCookie ('refreshToken', {path: '/'})
            .cookie ('accessToken', accessToken, accessTokenCookieOption)
            .cookie ('refreshToken', refreshToken, refreshTokenCookieOption)
            .end();
    }

    catch (error) {
        console.error (error);
        return res.status(500).json({error: 'Internal Server error'});
    }

    finally {
        client.release();
    }
};

export default generateNewTokens;
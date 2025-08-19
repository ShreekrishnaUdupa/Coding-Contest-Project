import pool from '../../utils/db.js';
import bcrypt from 'bcrypt';
import generateJWTAndCookieOptions from '../../utils/generate-jwt-and-cookie-options.js';

const loginUser = async (req, res) => {

    const {usernameOrEmail, password} = req.body;
    let client;

    try {
        client = await pool.connect ();
        client.query ('BEGIN');

        const result = await client.query (`Select id, hashed_password from users where (username = $1 or email = $1) and email_verified = true`, [usernameOrEmail]);

        if (result.rowCount === 0) {
            return res.status(400).json({error: "Wrong username or password"});
        }

        const user = result.rows[0];

        const matched = await bcrypt.compare (password, user.hashed_password);

        if (!matched) {
            return res.status(400).json({error: "Wrong username or password"});
        }

        const {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (user.id);
        
        await client.query (`update users set refresh_token = $1 where id = $2`, [refreshToken, user.id]);
        await client.query (`COMMIT`);

        return res.status(201)
                .cookie ('accessToken', accessToken, accessTokenCookieOption)
                .cookie ('refreshToken', refreshToken, refreshTokenCookieOption)
                .json ({accessToken, refreshToken});
    }

    catch (error) {
        console.log('Login error', error);
        return res.status(500).json({error: 'Login failed'});
    }

    finally {
        client.release();
    }
};

export default loginUser;
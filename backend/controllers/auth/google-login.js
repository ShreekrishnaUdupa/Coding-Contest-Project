import pool from '../../utils/db.js';
import generateJWTAndCookieOptions from '../../utils/generate-jwt-and-cookie-options.js';

const googleLogin = async (req, res) => {

	const {code} = req.body;
	const client = await pool.connect();

	try {

		const tokenResponse = await fetch (`https://oauth2.googleapis.com/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
			body: new URLSearchParams ({
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: process.env.GOOGLE_REDIRECT_URI,
				grant_type: 'authorization_code'
			})
		});

		const tokens = await tokenResponse.json();

		const userInfoResponse = await fetch ('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: { Authorization: `Bearer ${tokens.access_toke}`}
		});

		const userInfo = await userInfoResponse.json();
		console.log(userInfo);
		
		const email = userInfo.email;
		const username = email.split('@')[0];

		await client.query ('BEGIN');

		const result = await client.query (`INSERT INTO users (username, email, email_verified, oauth2_provider) VALUES ($1, $2, $3, $4) RETURNING id`, [username, email, true, 'google']);

		const userId = result.rows[0].id;

		const {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (userId);

        await client.query (`update users set refresh_token = $1 where id = $2`, [refreshToken, userId]);
        await client.query (`COMMIT`);

        return res.status(201)
                .cookie ('accessToken', accessToken, accessTokenCookieOption)
                .cookie ('refreshToken', refreshToken, refreshTokenCookieOption)
                .json ({accessToken, refreshToken, userInfo});
	}

	catch (error) {
		await client.query ('ROLLBACK');
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}

	finally {
    client.release();
	}
};

export default googleLogin;
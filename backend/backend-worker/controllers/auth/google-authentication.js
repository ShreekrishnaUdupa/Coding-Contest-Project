import {getUsersDBPool} from '../../routes/utils/get-db-pool.js';
import generateJWTAndCookieOptions from '../../routes/utils/generate-jwt-and-cookie-options.js';

const googleAuthentication = async (req, res) => {

	const {code} = req.body;
    const pool = getUsersDBPool();
	const client = await pool.connect();

	try {
		const tokenResponse = await fetch (`https://oauth2.googleapis.com/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
			headers: { Authorization: `Bearer ${tokens.access_token}`}
		});

		const userInfo = await userInfoResponse.json();
		
		const email = userInfo.email;
		const baseUsername = email.split('@')[0];

		await client.query ('BEGIN');

		const takenUsernamesResult = await client.query (`SELECT username FROM users WHERE username LIKE $1`, [`${baseUsername}%`]);

		const takenUsernames = new Set (takenUsernamesResult.rows.map (r => r.username));
		let username = baseUsername;
		let suffix = 1;

		while (takenUsernames.has(username))
		{
			username = `${baseUsername}${suffix}`;
			++suffix;
		}

		const insertUserResult = await client.query (
			`INSERT INTO users (username, email, email_verified, oauth2_provider) 
			VALUES ($1, $2, $3, $4) 
			ON CONFLICT (email) 
			DO UPDATE SET oauth2_provider = EXCLUDED.oauth2_provider
			RETURNING id`, 
			[username, email, true, 'google']
		);

		const userId = insertUserResult.rows[0].id;

		const {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (userId);

		await client.query (`UPDATE users SET refresh_token = $1 WHERE id = $2`, [refreshToken, userId]);
		await client.query (`COMMIT`);

		return res.status(201)
      .clearCookie ('accessToken', {path: '/'})
      .clearCookie ('refreshToken', {path: '/'})
			.cookie ('accessToken', accessToken, accessTokenCookieOption)
			.cookie ('refreshToken', refreshToken, refreshTokenCookieOption)
      .end();
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

export default googleAuthentication;
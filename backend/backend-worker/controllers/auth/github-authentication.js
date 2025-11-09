import { get } from 'http';
import {getUsersDBPool} from '../../routes/utils/get-db-pool.js';
import generateJWTAndCookieOptions from '../../routes/utils/generate-jwt-and-cookie-options.js';

const githubAuthentication = async (req, res) => {
	
	const {code} = req.body;
    const pool = getUsersDBPool();
	const client = await pool.connect();
	
	try {
		const tokenResponse = await fetch (`https://github.com/login/oauth/access_token`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify ({
        code,
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET
			})
		});

		const tokens = await tokenResponse.json();

		const [userResponse, emailResponse] = await Promise.all ([
			fetch (`https://api.github.com/user`, {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					Accept: 'application/json'
				}
			}),

			fetch (`https://api.github.com/user/emails`, {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					Accept: 'application/vnd.github+json'
				}
			})
		]);

		const userData = await userResponse.json();

		const email = (await emailResponse.json()).find(e => e.primary)?.email;
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
			[username, email, true, 'github']
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
		console.error(error);
		return res.status(500).json({error: 'Internal server error'});
	}
}

export default githubAuthentication;
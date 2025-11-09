import { getUsersDBPool } from '../../utils/get-db-pool.js';
import generateJWTAndCookieOptions from '../../utils/generate-jwt-and-cookie-options.js';

const verifyOtp = async (req, res) => {

    const pool = getUsersDBPool();
    let client;
    
    try {
        const {email, otp} = req.body;
        client = await pool.connect();

        await client.query ('BEGIN');
    
        const result = await client.query (
            `SELECT email_otps.otp, email_otps.user_id as id
            from email_otps
            join users on email_otps.user_id = users.id
            where email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            await client.query ('ROLLBACK');
            return res.status(404).json({error: 'No OTP found for this email'});
        }

        const user = result.rows[0];

        if (user.otp !== otp) {
            await client.query (`update email_otps set attempts = attempts + 1 where user_id = $1`, [user.id]);

            await client.query ('COMMIT');
            return res.status(401).json({error: 'Invalid OTP. Please enter a new OTP'});
        }

        await client.query (`update users set email_verified = true where id = $1`, [user.id]);
        await client.query (`delete from email_otps where user_id = $1`, [user.id]);

        const {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption} = generateJWTAndCookieOptions (user.id);

        await client.query (`update users set refresh_token = $1 where id = $2`, [refreshToken, user.id]);
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
        console.error('OTP verification error', error);
        return res.status(500).json({error: 'Internal Server error'});
    }

    finally {
        client.release();
    }
};

export default verifyOtp;
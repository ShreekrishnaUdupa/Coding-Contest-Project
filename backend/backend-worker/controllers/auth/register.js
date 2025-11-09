import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { getUsersDBPool } from '../../utils/get-db-pool.js';

async function sendOtp (client, userId, email) {
    
    const otp = String (Math.floor (1000 + Math.random() * 9000));

    const transporter = nodemailer.createTransport ({
        secure: true,
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS
        }
    });

    transporter.sendMail ({
        from: `Shreekrishna ${process.env.AUTH_USER}`,
        to: email,
        subject: 'Email Verification OTP',
        html: `Your OTP code is: <b> ${otp} </b> <br> <br> Your OTP code expires in 5 mins. Please do not share it with anyone.`
    });

    await client.query ('INSERT INTO email_otps (user_id, otp) VALUES ($1, $2);', [userId, otp]);
}

const registerUser = async (req, res) => {

    const {username, email, password} = req.body;
    const pool = getUsersDBPool();
    const client = await pool.connect();

    try {
        await client.query ('BEGIN');

        const existingUserResult = await client.query ('SELECT username, email FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (existingUserResult.rows.length !== 0) {

            await client.query ('ROLLBACK');
            
            if (existingUserResult.rows[0].email === email)
                return res.status(409).json({error: 'Email already exists. Please enter a different email'});

            if (existingUserResult.rows[0].username === username)
                return res.status(409).json({error: 'Username already exists. Please enter a different username'});
        }

        const workFactor = 10;
        const hashed_password = await bcrypt.hash (password, workFactor);

        const insertUserResult = await client.query ('INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id;', [username, email, hashed_password]);

        await sendOtp (client, insertUserResult.rows[0].id, email);

        await client.query ('COMMIT');

        return res.status(201).json ({message: `OTP has been sent to ${email} successfully`});
    }

    catch (error) {
        await client.query ('ROLLBACK');
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

    finally {
        client.release();
    }
};

export default registerUser;
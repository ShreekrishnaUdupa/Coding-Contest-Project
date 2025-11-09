import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import getRedisClient from './utils/get-redis-client.js';
import getRabbitMQChannel from './utils/get-rabbitmq-channel.js';

dotenv.config();

import authRoute from './routes/auth.js';
import contestsRoute from './routes/contests.js';
import problemsRoute from './routes/problems.js';

const app = express ();

app.use (cors({ origin: 'http://localhost:5173', credentials: true }));
app.use (express.urlencoded({ extended: true }));
app.use (express.json());
app.use (cookieParser());
app.use (helmet({hsts: process.env.NODE_ENV === 'production'}));

app.use ('/api/auth', authRoute);
app.use ('/api/contests', contestsRoute);
app.use ('/api/contests/:contestCode/problems', problemsRoute);

app.listen (4000, '0.0.0.0', async () => {
    await getRedisClient();
    await getRabbitMQChannel();
    console.log("Server running on port 4000");
});
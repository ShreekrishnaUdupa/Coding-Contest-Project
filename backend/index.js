import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.route.js';
import contestsRoute from './routes/contests.route.js';
import problemsRoute from './routes/problems.route.js';

const app = express ();

app.use (cors({origin: '*', credentials: true }));
app.use (express.urlencoded({ extended: true }));
app.use (express.json());
app.use (cookieParser());

app.use ('/api/auth', authRoute);
app.use ('/api/contests', contestsRoute);
app.use ('/api/problems', problemsRoute);

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
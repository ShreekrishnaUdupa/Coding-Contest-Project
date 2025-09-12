import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import authRoute from './routes/auth.js';
import contestsRoute from './routes/contests.js';
import problemsRoute from './routes/problems.js';

import getLeaderboard from './controllers/leaderboard/get-leaderboard.js';

const app = express ();

app.use (cors({ origin: 'http://localhost:5173', credentials: true }));
app.use (express.urlencoded({ extended: true }));
app.use (express.json());
app.use (cookieParser());

app.use ('/api/auth', authRoute);
app.use ('/api/contests', contestsRoute);
app.use ('/api/contests/id/:contestId/problems', problemsRoute);

const server = http.createServer(app);

const io = new Server (server, {
    cors: { origin: 'http://localhost:5173', credentials: true }
});

getLeaderboard(io);

server.listen(4000, () => {
    console.log("Server running on port 4000");
});
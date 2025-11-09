import express from 'express'
import verifyToken from '../middleware/verify-token.js';
import createContest from '../controllers/contests/create-contest.js';
import registerForContest from '../controllers/contests/register-for-contest.js';
import getContest from '../controllers/contests/get-contest.js';
import getLeaderboard from '../controllers/contests/get-leaderboard.js';

const router = express.Router();

router.post ('/', verifyToken, createContest);
router.get ('/:contestCode', getContest);
router.post ('/:contestCode/register', verifyToken, registerForContest);
router.get ('/:contestCode/leaderboard', verifyToken, getLeaderboard);

export default router;
import express from 'express'
import verifyToken from '../middleware/verify-token.middleware.js';
import createContest from '../controllers/contests/create-contest.js';

const router = express.Router();

router.post ('/', verifyToken, createContest);

export default router;
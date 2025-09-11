import express from 'express'
import verifyToken from '../middleware/verify-token.middleware.js';
import createContest from '../controllers/contests/create-contest.js';
import registerForContest from '../controllers/contests/register-for-contest.js';
import getContest from '../controllers/contests/get-contest.js';

const router = express.Router();

router.post ('/', verifyToken, createContest);
router.get ('/code/:contestCode', getContest);
router.post ('/register', verifyToken, registerForContest);

export default router;
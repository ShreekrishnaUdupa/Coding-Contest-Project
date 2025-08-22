import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import createProblem from '../controllers/problems/create-problem.js';
import getProblems from '../controllers/problems/get-problems.js';

const router = express.Router();

router.post ('/', verifyToken, createProblem);
router.get ('/', getProblems);

export default router;
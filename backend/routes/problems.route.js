import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import createProblem from '../controllers/problems/create-problem.js';

const router = express.Router();

router.post('/', verifyToken, createProblem);

export default router;
import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import runCode from '../controllers/submissions/run-code.js';

const router = express.Router();

router.post ('/', verifyToken, runCode);

export default router;
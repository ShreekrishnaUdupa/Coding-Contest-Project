import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import submitCode from '../controllers/submissions/submit-code.js';

const router = express.Router();

router.post ('/code-submission', verifyToken, submitCode);

export default router;
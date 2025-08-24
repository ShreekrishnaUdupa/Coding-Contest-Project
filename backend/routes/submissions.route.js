import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import submitCode from '../controllers/submissions/submit-code.js';
import verifyParticipant from '../middleware/verify-participant.js';

const router = express.Router();

router.post ('/code-submission', verifyToken, verifyParticipant, submitCode);

export default router;
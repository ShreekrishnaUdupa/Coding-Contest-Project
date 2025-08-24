import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import verifyParticipant from '../middleware/verify-participant.js';
import createProblem from '../controllers/problems/create-problem.js';
import getProblems from '../controllers/problems/get-problem.js';
import submitCode from '../controllers/problems/submit-code.js';

const router = express.Router();

router.post ('/', verifyToken, createProblem);
router.get ('/', verifyToken, )
router.get ('/', getProblems);
router.post ('/code-submission', verifyToken, verifyParticipant, submitCode);

export default router;
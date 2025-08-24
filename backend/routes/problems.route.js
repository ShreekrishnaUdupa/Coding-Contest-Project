import express from 'express';
import verifyToken from '../middleware/verify-token.middleware.js';
import verifyRoleParticipant from '../middleware/verify-role-participant.js';
import verifyRoleOrganizerOrModerator from '../middleware/verify-role-organizer-or-moderator.js';
import verifyRole from '../middleware/verify-role.js';
import createProblem from '../controllers/problems/create-problem.js';
import getLatestCode from '../controllers/problems/get-latest-code.js';
import getProblem from '../controllers/problems/get-problem.js';
import getProblems from '../controllers/problems/get-problem.js';
import getSampleTestCases from '../controllers/problems/get-sample-test-cases.js';
import getSubmissions from '../controllers/problems/get-submissions.js';
import runCodeAgainstCustomInput from '../controllers/problems/run-code-against-custom-input.js';
import runCode from '../controllers/problems/run-code.js';
import submitCode from '../controllers/problems/submit-code.js';

const router = express.Router();

router.post ('/', verifyToken, verifyRoleOrganizerOrModerator, createProblem);
router.get ('/:problemId/submissions/code', verifyToken, verifyRole, getLatestCode);
router.get ('/:problemId', verifyToken, verifyRole, getProblem);
router.get ('/', verifyToken, verifyRole, getProblems);
router.get ('/:problemId/sample-test-cases', verifyToken, verifyRole, getSampleTestCases);
router.get ('/:problemId/submissions', verifyToken, verifyRole, getSubmissions);
router.post ('/:problemId/run/custom', verifyToken, verifyRoleParticipant, runCodeAgainstCustomInput);
router.post ('/:problemId/run', verifyToken, verifyRoleParticipant, runCode);
router.post ('/:problemId/submissions', verifyToken, verifyRoleParticipant, submitCode);

export default router;
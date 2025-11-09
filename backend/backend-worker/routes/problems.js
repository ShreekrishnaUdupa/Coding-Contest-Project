import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import verifyRoleParticipant from '../middleware/verify-role-participant.js';
import verifyRoleOrganizerOrModerator from '../middleware/verify-role-organizer-or-moderator.js';
import verifyRole from '../middleware/verify-role.js';
import createProblem from '../controllers/problems/create-problem.js';
import getAllProblems from '../controllers/problems/get-all-problems.js';
import getProblem from '../controllers/problems/get-problem.js';
import getLatestSubmission from '../controllers/problems/get-latest-submission.js';
import getAllSubmissions from '../controllers/problems/get-all-submissions.js';
import runCode from '../controllers/problems/run-code.js';
import submitCode from '../controllers/problems/submit-code.js';

const router = express.Router ({mergeParams: true});

router.post ('/', verifyToken, verifyRoleOrganizerOrModerator, createProblem);
router.get ('/', verifyToken, verifyRole, getAllProblems);
router.get ('/:problemId', verifyToken, verifyRole, getProblem);
router.get ('/:problemId/submissions/latest', verifyToken, verifyRole, getLatestSubmission);
router.get ('/:problemId/submissions', verifyToken, verifyRole, getAllSubmissions);
router.post ('/:problemId/run', verifyToken, verifyRoleParticipant, runCode);
router.post ('/:problemId/submissions', verifyToken, verifyRoleParticipant, submitCode);

export default router;
import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import verifyRoleParticipant from '../middleware/verify-role-participant.js';
import verifyRoleOrganizerOrModerator from '../middleware/verify-role-organizer-or-moderator.js';
import verifyRole from '../middleware/verify-role.js';
import createProblem from '../controllers/problems/create-problem.js';
import getAllProblems from '../controllers/problems/get-all-problems.js';
import getProblem from '../controllers/problems/get-problem.js';
import getRecentSubmission from '../controllers/problems/get-recent-submission.js';
import getAllSubmissions from '../controllers/problems/get-all-submissions.js';
import runCode from '../controllers/problems/run-code.js';
import submitCode from '../controllers/problems/submit-code.js';

const router = express.Router ({mergeParams: true});

router.post ('/', verifyToken, verifyRoleOrganizerOrModerator, createProblem);
router.get ('/', verifyToken, verifyRole, getAllProblems);
router.get ('/id/:problemId', verifyToken, verifyRole, getProblem);
router.get ('/id/:problemId/submissions/recent', verifyToken, verifyRole, getRecentSubmission);
router.get ('/id/:problemId/submissions', verifyToken, verifyRole, getAllSubmissions);
router.post ('/id/:problemId/run', verifyToken, verifyRoleParticipant, runCode);

export default (io) => {
    router.post ('/id/:problemId/submissions', verifyToken, verifyRoleParticipant, submitCode(io));
    return router;
}
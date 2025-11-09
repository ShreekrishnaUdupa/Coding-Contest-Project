import express from 'express';

import verifyToken from '../middleware/verify-token.js';

import loginUser from '../controllers/auth/login.js';
import registerUser from '../controllers/auth/register.js';
import verifyOtp from '../controllers/auth/verify-otp.js';
import googleAuthentication from '../controllers/auth/google-authentication.js';
import githubAuthentication from '../controllers/auth/github-authentication.js';
import generateNewTokens from '../controllers/auth/generate-new-tokens.js';
import logout from '../controllers/auth/logout.js';
import returnAuthStatus from '../controllers/auth/return-auth-status.js';

const router = express.Router();

router.post ('/login', loginUser);
router.post ('/register', registerUser);
router.post ('/otp-verification', verifyOtp);
router.post ('/google', googleAuthentication);
router.post ('/github', githubAuthentication);
router.post ('/new-tokens', generateNewTokens);
router.post ('/logout', verifyToken, logout);
router.post ('/check', verifyToken, returnAuthStatus);

export default router;
import express from 'express';

import loginUser from '../controllers/auth/login.js';
import registerUser from '../controllers/auth/register.js';
import verifyOtp from '../controllers/auth/verify-otp.js';
import generateNewTokens from '../controllers/auth/generate-new-tokens.js';

const router = express.Router();

router.post ('/login', loginUser);
router.post ('/register', registerUser);
router.post ('/otp-verification', verifyOtp);
router.post ('/new-tokens', generateNewTokens);

export default router;

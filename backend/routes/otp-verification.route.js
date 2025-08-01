const express = require ('express');
const {verifyOTPAndGenerateJWT} = require ('../controllers/otp-verification.controller');

const router = express.Router ();

router.post ('/otp-verification', verifyOTPAndGenerateJWT);

module.exports = router;
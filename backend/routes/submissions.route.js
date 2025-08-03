const express = require ('express');
const verifyToken = require ('../middleware/verify-token.middleware');
const {runCode} = require ('../middleware/submissions.controller');

const router = express.Router();

router.post ('/submissions', verifyToken, runCode);

module.exports = router;
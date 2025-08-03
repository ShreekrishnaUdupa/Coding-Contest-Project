const express = require ('express');
const verifyToken = require ('../middleware/verify-token.middleware');

const router = express.Router();

router.post ('/submissions', verifyToken, runCode);

module.exports = router;
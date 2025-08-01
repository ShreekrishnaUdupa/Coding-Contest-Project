const express = require ('express');
const {refreshTokens} = require ('../controllers/refresh-tokens.controller');

const router = express.Router();

router.post('/refresh-tokens', refreshTokens);

module.exports = router;
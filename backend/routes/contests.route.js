const express = require ('express');
const verifyToken = require ('../middleware/verify-token.middleware');
const {createContest} = require ('../controllers/contests.controller');

const router = express.Router ();

router.post('/contests', verifyToken, createContest);

module.exports = router;
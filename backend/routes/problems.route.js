const express = require ('express');
const verifyToken = require ('../middleware/verify-token.middleware');
const {createProblem} = require ('../controllers/problems.controller');

const router = express.Router();

router.post('/problems', verifyToken, createProblem);

module.exports = router;
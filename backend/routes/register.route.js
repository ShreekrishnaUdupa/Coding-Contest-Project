const express = require ('express');
const {registerUser} = require ('../controllers/register.controller');

const router = express.Router();

router.post ('/register', registerUser);

module.exports = router;
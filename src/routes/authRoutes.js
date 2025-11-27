const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { authMiddleware } = require('../middlewares/auth');

router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.get('/me', authMiddleware, getMe);

module.exports = router;

const express = require('express');
const {loginUser, registerUser, logout} = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;
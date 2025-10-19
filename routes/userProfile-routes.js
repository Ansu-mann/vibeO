const express = require('express');
const { updateUserProfile } = require('../controllers/update-user-profile');
const authMiddleware = require('../middlewares/auth-middleware')
const router = express.Router();

router.patch('/edit', authMiddleware, updateUserProfile)

module.exports = router;
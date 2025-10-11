const express = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')
const {videoUploadController, getAllVideos} = require('../controllers/videoUpload-controller')
const multerMiddleware = require('../middlewares/multer-middleware')

const router = express.Router()

router.post('/upload', authMiddleware, adminMiddleware, multerMiddleware, videoUploadController)
router.get('/fetch', authMiddleware, getAllVideos)

module.exports = router;
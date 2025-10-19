const express = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const {videoUploadController, getAllVideos, deleteVideoById} = require('../controllers/videoUpload-controller')
const multerMiddleware = require('../middlewares/multer-middleware')

const router = express.Router()

router.post('/upload', authMiddleware, multerMiddleware, videoUploadController)
router.get('/fetch', authMiddleware, getAllVideos)
router.delete('/delete/:id', authMiddleware, deleteVideoById)

module.exports = router;
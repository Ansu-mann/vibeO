const express = require('express')
const authMiddleware = require('../middlewares/auth-middleware')
const {videoUploadController, getAllVideos, deleteVideoById} = require('../controllers/upload-controller')
const {videoUpload} = require('../middlewares/multer-middleware')

const router = express.Router()

router.post('/upload', authMiddleware, videoUpload, videoUploadController)
router.get('/fetch', authMiddleware, getAllVideos)
router.delete('/delete/:id', authMiddleware, deleteVideoById)

module.exports = router;
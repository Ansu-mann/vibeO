const multer = require('multer')

// Use memory storage for cloud deployment
const storage = multer.memoryStorage()

// Adding file filter function
const videoFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('video')){
        cb(null, true)
    }else{
        cb(new Error(`Only Video allowed to upload`))
    }
}

const imageFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new Error(`Only Image allowed to upload`))
    }
}

const videoUpload = multer({
    storage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024   // 30MB
    }
}).single('video')

const imageUpload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024   // 10MB
    }
}).single('image')

module.exports = {videoUpload, imageUpload}
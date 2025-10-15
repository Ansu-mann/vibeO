const multer = require('multer')

// Use memory storage for cloud deployment
const storage = multer.memoryStorage()

// Adding file filter function
const checkFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('video')){
        cb(null, true)
    }else{
        cb(new Error(`Only Video allowed to upload`))
    }
}


module.exports = multer({
    storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024   // 30MB
    }
}).single('video')
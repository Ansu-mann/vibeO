const multer = require('multer')
const path = require('path')

// Setting storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

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
        fileSize: 20 * 1024 * 1024   // 20MB
    }
}).single('video')
const Video = require('../models/Video')
const uploadToCloud = require('../helpers/videoUpload')

const videoUploadController = async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: `Please select a file to upload`
            })
        }
        
        // Use buffer and original name for cloud upload
        const {url, publicId} = await uploadToCloud(req.file.buffer, req.file.originalname);

        const newlyUpload = await Video.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        return (
            res.status(201).json({
                success: true,
                message: `Video uploaded to cloud`,
                newlyUpload
            })
        )
        
    }catch(error){
        console.error('Video upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading video. Please try again.'
        })
    }
}

const getAllVideos = async(req, res) => {
    try{
        const videosFromDB = await Video.find()
        return res.status(200).json({
            success: true,
            data: videosFromDB
        })
    }catch(error){
        console.error(`Error fetching the videos`, error)
        return res.status(500).json({
            success: false,
            message: 'Error fetching videos. Please try again.'
        })
    }
}

module.exports = {videoUploadController, getAllVideos}
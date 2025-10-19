const Video = require('../models/Video')
const uploadToCloud = require('../helpers/videoUpload')
const cloudinary = require('../config/cloudinary')

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
            title: req.body.title,
            description: req.body.description,
            uploaderId: req.userInfo.userId,
            uploaderUserName: req.userInfo.username
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

const deleteVideoById = async(req, res) => {
    try{
        const getCurrentIdOfVideoToDelete = req.params.id;
        const userId = req.userInfo.userId

        const video = await Video.findById(getCurrentIdOfVideoToDelete);
        if(!video){
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            })
        }

        // check if any other user is trying to delete
        if(video.uploaderId.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: 'Only the owner can delete the video !'
            })
        }

        // delete the video from cloudinary
        await cloudinary.uploader.destroy(video.publicId, {resource_type: 'video'})

        // delete from mongoDB
        await Video.findByIdAndDelete(getCurrentIdOfVideoToDelete)

        return res.status(200).json({
            success: true,
            message: 'Video delete successfully !'
        })
    }catch(error){
        console.error(`Error deleting the video`, error)
        return res.status(500).json({
            success: false,
            message: 'Unable to delete the Video, Please try again !'
        })
    }
}

module.exports = {videoUploadController, getAllVideos, deleteVideoById}
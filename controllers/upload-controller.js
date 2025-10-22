const Video = require('../models/Video')
const UserProfile = require('../models/UserProfile')
const { uploadVideoToCloud, uploadImageToCloud } = require('../helpers/uploader')
const { updateUserProfile } = require('../controllers/update-user-profile')
const cloudinary = require('../config/cloudinary')

const videoUploadController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: `Please select a file to upload`
            })
        }

        const title = req.body.title || '';
        const description = req.body.description || '';
        const uploaderId = req.userInfo.userId;
        const uploaderUserName = req.userInfo.username;

        // Use buffer and original name for cloud upload
        const startTimeToUpload = Date.now();

        const { url, publicId } = await uploadVideoToCloud(req.file.buffer, req.file.originalname);

        const endTimeToUpload = Date.now();
        const uploadTime = endTimeToUpload - startTimeToUpload;

        console.log(`Video uploaded to cloud in ${uploadTime / 1000} sec`);

        const newlyUpload = await Video.create({
            url,
            publicId,
            title,
            description,
            uploaderId,
            uploaderUserName
        })

        return (
            res.status(201).json({
                success: true,
                message: `Video uploaded to cloud`,
                newlyUpload
            })
        )

    } catch (error) {
        console.error('Video upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading video. Please try again.'
        })
    }
}

const getAllVideos = async (req, res) => {
    try {
        const videosFromDB = await Video.find()
        return res.status(200).json({
            success: true,
            data: videosFromDB
        })
    } catch (error) {
        console.error(`Error fetching the videos`, error)
        return res.status(500).json({
            success: false,
            message: 'Error fetching videos. Please try again.'
        })
    }
}

const deleteVideoById = async (req, res) => {
    try {
        const getCurrentIdOfVideoToDelete = req.params.id;
        const userId = req.userInfo.userId

        const video = await Video.findById(getCurrentIdOfVideoToDelete);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            })
        }

        // check if any other user is trying to delete
        if (video.uploaderId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the owner can delete the video !'
            })
        }

        // delete the video from cloudinary
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' })

        // delete from mongoDB
        await Video.findByIdAndDelete(getCurrentIdOfVideoToDelete)

        return res.status(200).json({
            success: true,
            message: 'Video delete successfully !'
        })
    } catch (error) {
        console.error(`Error deleting the video`, error)
        return res.status(500).json({
            success: false,
            message: 'Unable to delete the Video, Please try again !'
        })
    }
}

const updateUserProfile_and_Picture = async (req, res) => {

    let newProfilePhotoId = null;
    try {

        if (!req.file) {
            return updateUserProfile(req, res);
        }

        const { name, bio, gender } = req.body;
        const userId = req.userInfo.userId;
        const userName = req.userInfo.username;

        const user = await UserProfile.findOne({ userId: userId });

        //upload new profile photo
        const { url, publicId } = await uploadImageToCloud(req.file.buffer, req.file.originalname);
        newProfilePhotoId = publicId

        let UserProfileData, oldProfilePhotoId;

        if (user) {
            //store existing profile photo
            oldProfilePhotoId = user.profilePhotoPublicId

            UserProfileData = await UserProfile.findByIdAndUpdate(user.id, {
                name, bio, gender, userId, userName, profilePhotoUrl: url, profilePhotoPublicId: publicId
            }, { new: true });

            try {
                // delete existing profile photo using the stored value
                await cloudinary.uploader.destroy(oldProfilePhotoId);
            } catch (error) {
                console.error('Failed to delete old photo !');
            }

        } else {
            UserProfileData = await UserProfile.create({
                name, bio, gender, userId, userName, profilePhotoUrl: url, profilePhotoPublicId: publicId
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User details updated successfully',
            UserProfileData
        })

    } catch (error) {
        console.error('Error in updateUserProfile_and_Picture', error);

        if (newProfilePhotoId) {
            try {
                await cloudinary.uploader.destroy(newProfilePhotoId);
            } catch (error) {
                console.error('cleanUp Failed', error);
            }
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to upload profile picture'
        })
    }
}

module.exports = { videoUploadController, getAllVideos, deleteVideoById, updateUserProfile_and_Picture }
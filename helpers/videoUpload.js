const cloudinary = require('../config/cloudinary')

const uploadToCloud = async(filePath) => {
    try{
        const res = await cloudinary.uploader.upload(filePath, {
            resource_type: "video"
        });
        return {
            url: res.secure_url,
            publicId: res.public_id
        }
    }catch(error){
        console.error(`Error uploading to cloud! Please try again!`, error)
        throw error;
    }
}

module.exports = uploadToCloud;
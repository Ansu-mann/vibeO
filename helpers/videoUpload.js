const cloudinary = require('../config/cloudinary')

const uploadToCloud = async(fileBuffer, originalName) => {
    try{
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    public_id: `video_${Date.now()}_${originalName.split('.')[0]}`
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    }
                }
            ).end(fileBuffer);
        });
    }catch(error){
        console.error(`Error uploading to cloud! Please try again!`, error)
        throw error;
    }
}

module.exports = uploadToCloud;
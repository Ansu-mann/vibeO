const UserProfile = require('../models/UserProfile');

const updateUserProfile = async (req, res) => {

    try {
        const {name, bio, gender} = req.body;
        const userId = req.userInfo.userId;
        const userName = req.userInfo.username;

        const user = await UserProfile.findOne({ userId: userId });

        let UserProfileData;

        if (user) {
            UserProfileData = await UserProfile.findByIdAndUpdate(user.id, { 
                name, bio, gender, userId, userName 
            }, { new: true });
        } else {
            UserProfileData = await UserProfile.create({
                name, bio, gender, userId, userName
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User details updated successfully',
            UserProfileData
        })

    } catch (error) {
        console.error('Error updating the user profile, error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating the user profile, Please try again!'
        })
    }
}

module.exports = { updateUserProfile }
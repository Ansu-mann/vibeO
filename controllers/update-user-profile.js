const User = require('../models/User');

const updateUserProfile = async (req, res) => {

    try {
        let { fullname, bio, gender, username } = req.body;
        const userId = req.userInfo.userId;
        username = username?.toLowerCase();
        gender = gender?.toLowerCase();

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        try {
            if (username && username !== user.username) {
                const existingUser = await User.findOne({ username: username });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username already taken! Please choose another one'
                    })
                }
            }
        } catch (error) {
            console.error('Error checking username', error);
            return res.status(500).json({
                success: false,
                message: 'Error checking username'
            })
        }

        let UserProfileData;

        UserProfileData = await User.findByIdAndUpdate(userId, {
            fullname, bio, gender, username
        }, { new: true });

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
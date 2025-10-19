const mongoose = require('mongoose');
const User = require('./User')

const UserProfileSchema = new mongoose.Schema({
    name: {
        type: String
    },
    bio: {
        type: String
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['male', 'female', "couldn't decide"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    userName: {
        type: mongoose.Schema.Types.String,
        ref: User
    }
}, {timestamps: true})

module.exports = mongoose.model('UserProfile', UserProfileSchema)
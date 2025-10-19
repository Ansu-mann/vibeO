const mongoose = require('mongoose')
const User = require('./User')

const VideoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    uploaderUserName: {
        type: mongoose.Schema.Types.String,
        ref: User
    }
}, { timestamps: true })

module.exports = mongoose.model('Video', VideoSchema);
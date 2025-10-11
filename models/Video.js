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
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
})

module.exports = mongoose.model('Video', VideoSchema);
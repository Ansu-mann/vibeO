const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB is connected successfully !`)
    } catch (error) {
        console.error(`mongoDB connection failed`, error);
        process.exit(1);
    }
}

module.exports = connectToDb;
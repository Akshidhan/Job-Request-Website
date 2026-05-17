const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected successfully');
    } catch (error) {
        return console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;
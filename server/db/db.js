const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // 👈 Add this at the very top

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch(err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

module.exports = connectDB;
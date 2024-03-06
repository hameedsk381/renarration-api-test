import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
const connectDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;

import mongoose from 'mongoose'

const connectDB = async () => {

    const MONGO_URI = process.env.MONGO_URI || '';

    try {
        const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 20000,
    });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error:any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
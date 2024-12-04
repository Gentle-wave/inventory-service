import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string; // Ensure MONGO_URI is defined
    if (!uri) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    // Connect to MongoDB
    await mongoose.connect(uri);

    console.log('✅ MongoDB connection established successfully.');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error; // Rethrow the error for handling in the main app
  }
};

export default connectDB;

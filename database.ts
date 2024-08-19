import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI ?? '';

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${con.connection.host}`);
  }

  catch (error) {
    console.log(error);
    process.exit(1);
  }
}

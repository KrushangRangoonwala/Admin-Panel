// connectDB.js
import mongoose from "mongoose";
import { scheduleEmail } from './controllers/emailSenderController.js';

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully. ');
        scheduleEmail();
    } catch (error) {
        console.log('# error', error)
    }
} 
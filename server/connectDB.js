import mongoose from "mongoose";


export async function connectToDB(url){
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected successfully. ');
    } catch (error) {
    console.log('# error', error)        
    }
}
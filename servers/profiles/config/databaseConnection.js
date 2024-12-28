import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST || "127.0.0.1";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE || "admin";
const MONGO_DB = process.env.MONGO_DB;
const JWT_SECRET = process.env.JWT_SECRET;

// Build MongoDB URI
const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_AUTH_SOURCE}`;

// Function to establish MongoDB connection
async function connectionStatus() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process on failure
    }
}

// Export connection function and JWT_SECRET
export { JWT_SECRET, connectionStatus };

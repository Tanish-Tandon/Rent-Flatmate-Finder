import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the connection string defined in .env
 * Includes error handling to prevent the server from starting without a DB connection.
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error("Database URI is missing in environment variables.");
        }

        const conn = await mongoose.connect(mongoUri);

        // Logging the host for visibility during development/debugging
        console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
        
        // Monitor connection events
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB Connection Error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn("MongoDB connection lost. Reconnecting...");
        });
        
    } catch (error) {
        // Logging error and exiting process as the app cannot function without DB
        console.error(`Database Connection Failed: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDB;
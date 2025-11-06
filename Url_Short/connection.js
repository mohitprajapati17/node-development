/**
 * ============================================
 * DATABASE CONNECTION MODULE (connection.js)
 * ============================================
 * This file handles connecting to MongoDB database.
 * Separated into its own module for reusability and organization.
 */

// Import Mongoose - MongoDB object modeling library for Node.js
// Mongoose provides a schema-based solution to model your application data
const mongoose=require("mongoose");

/**
 * Connect to MongoDB database
 * 
 * @param {string} url - MongoDB connection string
 *                    Format: "mongodb://host:port/database_name"
 *                    Example: "mongodb://127.0.0.1:27017/url_shortener"
 * 
 * @returns {Promise} - Promise that resolves when connection is established
 *                    or rejects if connection fails
 * 
 * Usage: await connectToMongoose("mongodb://127.0.0.1:27017/url_shortener")
 */
async function connectToMongoose(url){
    // mongoose.connect() returns a Promise
    // This will attempt to connect to the MongoDB server
    // If successful, Promise resolves
    // If fails (wrong URL, server down, etc.), Promise rejects
    return mongoose.connect(url);
}

// Export the function so other files can use it
module.exports={connectToMongoose};
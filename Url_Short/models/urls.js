/**
 * ============================================
 * URL MODEL (models/urls.js)
 * ============================================
 * Defines the structure (schema) of URL documents in MongoDB.
 * This represents shortened URLs and their analytics.
 */

// Import Mongoose to create schemas and models
const mongoose=require("mongoose");

/**
 * URL Schema - defines the structure of a URL document
 * 
 * This represents a shortened URL entry in the database.
 */
const urlSchema =new mongoose.Schema({
    // Short URL identifier (the shortId like "abc123")
    url:{
        type:String,                    // Field must be a string
        required:true,                  // Field is mandatory
        unique:true,                    // Each short URL must be unique
                                        // Example: "abc123" can only exist once
    },
    
    // Original URL that the short URL redirects to
    redirectUrl:{
        type:String,                    // Field must be a string
        required:true,                  // Field is mandatory
        // This is the actual long URL that users will be redirected to
        // Example: "https://www.example.com/very/long/url/path"
    },
    
    // Array to track when the short URL was visited
    visitHistory:[{
        timestamps:Number                // Each entry is a timestamp (Unix timestamp)
                                        // Example: [1704067200000, 1704153600000]
                                        // This allows tracking when URL was accessed
    }],
})

/**
 * Create Url Model from schema
 * 
 * mongoose.model() creates a model that represents a collection in MongoDB
 * First parameter: "url" - name of the collection (MongoDB will pluralize to "urls")
 * Second parameter: urlSchema - the schema definition
 * 
 * The Url model provides methods like:
 * - Url.create() - create a new shortened URL
 * - Url.findOne() - find a URL by criteria
 * - Url.findById() - find URL by ID
 */
const Url=mongoose.model("url",urlSchema);

// Export the Url model so other files can use it
module.exports={Url};
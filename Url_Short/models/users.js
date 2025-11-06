/**
 * ============================================
 * USER MODEL (models/users.js)
 * ============================================
 * Defines the structure (schema) of User documents in MongoDB.
 * Think of this as a blueprint for what a user document looks like.
 */

// Import Mongoose to create schemas and models
const mongoose =require("mongoose");

/**
 * User Schema - defines the structure of a User document
 * 
 * A schema is like a contract: it defines what fields are allowed,
 * what types they are, and what rules they must follow.
 */
const userSchema =new mongoose.Schema({
    // Email field configuration
    email:{
        type:String,                    // Field must be a string
        required:true,                  // Field is mandatory - cannot create user without email
        unique:true,                    // No two users can have the same email
        lowercase:true,                 // Automatically converts email to lowercase
                                        // Example: "USER@EXAMPLE.COM" becomes "user@example.com"
    },
    
    // Username field configuration
    username:{
        type:String,                    // Field must be a string
        required:true,                  // Field is mandatory
        // Note: No unique constraint - multiple users could have same username
    },
    
    // Password field configuration
    password:{
        type:String,                    // Field must be a string
        required:true,                  // Field is mandatory
        // Note: In production, you should never return this field in responses
        // The password will be hashed before storing (see controllers/UserControllers.js)
    },
    
    // Role field configuration
    role:{
        type:String,                    // Field must be a string
        enum:["user","admin"],          // Only allows "user" or "admin" - any other value is rejected
        default:"user",                 // If no role is provided, defaults to "user"
                                        // This means new users are regular users by default
    }
});

/**
 * Create User Model from schema
 * 
 * mongoose.model() creates a model that represents a collection in MongoDB
 * First parameter: "user" - name of the collection (MongoDB will pluralize to "users")
 * Second parameter: userSchema - the schema definition
 * 
 * The User model provides methods like:
 * - User.create() - create a new user
 * - User.findOne() - find a user by criteria
 * - User.findById() - find user by ID
 * - User.updateOne() - update a user
 * - User.deleteOne() - delete a user
 */
const User = mongoose.model("user",userSchema);

// Export the User model so other files can use it
module.exports={User};
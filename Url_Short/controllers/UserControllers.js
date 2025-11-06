/**
 * ============================================
 * USER CONTROLLERS (controllers/UserControllers.js)
 * ============================================
 * Contains the business logic for user-related operations.
 * Controllers handle the actual work: database operations, validation, etc.
 */

// Import User model - allows us to interact with users collection in MongoDB
const {User}=require("../models/users");

// Import bcrypt library - used for hashing and comparing passwords
// bcrypt is a cryptographic hashing function - it's one-way (can't reverse it)
const bcrypt=require("bcrypt");

// Import setUser function - creates JWT tokens for authenticated users
const {setUser}=require("../service/auth");

/**
 * Handle User Signup (Create New User)
 * 
 * Route: POST /user/signup
 * 
 * Flow:
 * 1. Extract user data from request body
 * 2. Hash the password (never store plain text passwords!)
 * 3. Validate required fields
 * 4. Create user in database
 * 5. Return success response
 * 
 * @param {Object} req - Express request object
 *                      req.body contains: {email, username, password, role}
 * @param {Object} res - Express response object (used to send response to client)
 */
async function handleCreateUser(req,res){
    // Extract data from request body
    // req.body is populated by express.json() middleware
    // Destructuring: pulls out email, username, password, role from req.body
    const {email, username, password, role}=req.body;
    
    // Hash the password before storing in database
    // bcrypt.hash() takes plain password and creates a hash
    // Second parameter (10) is "salt rounds" - how many times to hash (higher = more secure but slower)
    // This returns a hash like: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    // The hash is one-way - you can't get the original password back
    // But you can compare a plain password with a hash using bcrypt.compare()
    const hashedPassword=await bcrypt.hash(password,10);
    
    // Validate that all required fields are provided
    // If any field is missing, return error response and stop execution
    if(!email || !password || !username) {
        return res.status(400).json({error: "All fields are required"});
    }
    
    // Create new user document in MongoDB
    // User.create() is a Mongoose method that:
    // 1. Validates data against the schema (from models/users.js)
    // 2. Creates a new document in the "users" collection
    // 3. Returns the created user document
    // We store the hashed password, not the plain text password
    await User.create({
        email,                      // User's email
        password:hashedPassword,    // Hashed password (NOT plain text!)
        username,                   // User's username
        role                        // User's role (defaults to "user" if not provided)
    });
    
    // Return success response to client
    // Status 201 = "Created" - indicates new resource was created
    return res.status(201).json({message: "User created successfully"});
}

/**
 * Handle User Login (Authenticate User)
 * 
 * Route: POST /user/login
 * 
 * Flow:
 * 1. Extract email and password from request body
 * 2. Find user in database by email
 * 3. Compare provided password with stored hashed password
 * 4. If password matches, create JWT token
 * 5. Return token and user data to client
 * 
 * @param {Object} req - Express request object
 *                      req.body contains: {email, password}
 * @param {Object} res - Express response object
 */
async function handleLogin(req,res){
    // Extract email and password from request body
    const {email, password, role} = req.body;

    // Find user in database by email
    // User.findOne() searches the "users" collection for a document with matching email
    // Returns the user document if found, null if not found
    const user=await User.findOne({email});
    
    // Check if user exists
    // If user is null, email doesn't exist in database
    if(!user) {
        return res.status(400).json({error: "User not found"});
    }
    
    // Compare provided password with stored hashed password
    // bcrypt.compare() takes:
    //   - Plain password from request (what user typed)
    //   - Hashed password from database (what we stored)
    // Returns true if they match, false if they don't
    // This works because bcrypt can compare plain text with hash, but can't reverse the hash
    const isMatch=await bcrypt.compare(password, user.password);

    // Check if password is correct
    // If passwords don't match, return error and stop
    if(!isMatch) {
        return res.status(400).json({error: "Invalid password"});
    }
    
    // Password is correct! Create JWT token for this user
    // setUser() creates a token containing: {id, email, role}
    // This token will be sent to client and used for authentication
    const token=setUser(user, user._id, user.role || role);

    // Return success response with token and user data
    // Client will store this token in localStorage and send it with future requests
    return res.status(200).json({
        message: "Login successful",
        token: token,                // JWT token - client stores this in localStorage
        user: {
            id: user._id,            // User's MongoDB ID
            email: user.email,        // User's email
            username: user.username,  // User's username
            role: user.role          // User's role ("user" or "admin")
        }
    });
}

// Export both functions so routes can use them
module.exports={handleCreateUser,handleLogin};

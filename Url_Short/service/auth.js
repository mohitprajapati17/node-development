/**
 * ============================================
 * AUTHENTICATION SERVICE (service/auth.js)
 * ============================================
 * Handles JWT (JSON Web Token) creation and verification.
 * JWT tokens are used to authenticate users without storing session data.
 */

// Import jsonwebtoken library - handles creating and verifying JWT tokens
const jsonwebtoken=require("jsonwebtoken");

// Secret key used to sign and verify tokens
// IMPORTANT: In production, this should be in environment variables (.env file)
// Anyone with this key can create valid tokens - keep it secret!
const JWT_SECRET="mysecretkey";

/**
 * Create a JWT token for a user
 * 
 * @param {Object} user - User object from database
 * @param {string} id - User's ID (MongoDB _id)
 * @param {string} role - User's role ("user" or "admin")
 * 
 * @returns {string} - JWT token (a long encrypted string)
 * 
 * How it works:
 * 1. Takes user data and creates a "payload" (the data we want in the token)
 * 2. Signs the payload with our secret key using jsonwebtoken.sign()
 * 3. Returns the token as a string
 * 
 * The token contains: {id, email, role}
 * Client will store this token and send it with every request
 */
function setUser(user, id, role){
    // Create payload - the data we want to embed in the token
    // This data can be read from the token (but not modified without the secret)
    const payload={
        id,                        // User's MongoDB _id
        email:user.email,         // User's email
        role                       // User's role ("user" or "admin")
    };
    
    // Sign the payload with our secret key
    // This creates a token that can be verified later
    // The token is a long string like: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const token= jsonwebtoken.sign(payload,JWT_SECRET);
    
    // Return the token - this will be sent to client
    return token;
}

/**
 * Verify and decode a JWT token
 * 
 * @param {string} token - JWT token string from client
 * 
 * @returns {Object|null} - Decoded user data if token is valid, null if invalid
 *                          Returns: {id, email, role, iat, exp}
 * 
 * How it works:
 * 1. Takes the token string
 * 2. Verifies it was signed with our secret key using jsonwebtoken.verify()
 * 3. If valid, returns the decoded payload (the data we stored in setUser)
 * 4. If invalid (wrong secret, expired, tampered), throws error and returns null
 * 
 * This is used in middleware to check if user is authenticated
 */
function getUser(token){
    try{
        // Verify the token and decode the payload
        // jsonwebtoken.verify() does three things:
        // 1. Checks if token is valid format
        // 2. Verifies it was signed with our secret key
        // 3. Checks if token has expired (if we set expiration)
        // If all checks pass, returns the payload we stored in setUser()
        return jsonwebtoken.verify(token,JWT_SECRET);
    }catch(error){
        // If token is invalid, expired, or tampered with:
        // - Log the error for debugging
        // - Return null to indicate authentication failed
        console.error(error);
        return null;
    }
}

// Export both functions so other files can use them
module.exports={setUser,getUser};

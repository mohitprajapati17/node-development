/**
 * ============================================
 * URL CONTROLLERS (controllers/urlControllers.js)
 * ============================================
 * Contains the business logic for URL shortening operations.
 */

// Import Url model - allows us to interact with urls collection in MongoDB
const {Url}=require("../models/urls");

// Import shortid library - generates short, unique IDs
// Example: "abc123xyz" instead of long MongoDB IDs
const shortid=require("shortid");

/**
 * Handle Creating Short URL
 * 
 * Route: POST /url
 * Access: Protected (requires authentication with "user" role)
 * 
 * Flow:
 * 1. Extract URL from request body
 * 2. Validate URL is provided
 * 3. Generate a unique short ID
 * 4. Create URL document in database
 * 5. Return short ID to client
 * 
 * @param {Object} req - Express request object
 *                      req.body contains: {url: "https://example.com"}
 *                      req.user contains: {id, email, role} (from authenticateToken middleware)
 * @param {Object} res - Express response object
 */
async function handleCreateShortUrl(req,res){
    // Extract request body
    // req.body contains the data sent by client
    const body=req.body;
    
    // Validate that URL is provided
    // If no URL in request body, return error and stop
    if(!body.url) {
        return res.status(400).json({error: "url is required"});
    }
    
    // Generate a unique short ID
    // shortid() generates a random string like "abc123xyz"
    // This will be used as the short URL identifier
    // Example: Original URL "https://example.com/very/long/path"
    //          Short ID: "abc123"
    //          Short URL: "http://yoursite.com/abc123"
    const shortId=shortid();
    
    // Create new URL document in MongoDB
    // Url.create() creates a new document in the "urls" collection
    await Url.create({
        url:shortId,                    // Short ID (the identifier)
        redirectUrl:body.url,            // Original long URL (where to redirect)
        visitHistory:[]                  // Empty array - will track visits later
    });
    
    // Return the short ID to client
    // Client can use this to construct the full short URL
    // Status 200 is default, so we can omit it
    return res.json({id:shortId});
}

// Export the function so routes can use it
module.exports={handleCreateShortUrl};
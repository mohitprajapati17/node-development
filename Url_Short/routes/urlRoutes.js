/**
 * ============================================
 * URL ROUTES (routes/urlRoutes.js)
 * ============================================
 * Defines routes for URL shortening functionality.
 * These routes are protected - require authentication.
 */

// Import Express Router - creates modular route handlers
const express=require("express");

// Import controller function - contains the actual logic
const {handleCreateShortUrl}=require("../controllers/urlControllers");

// Create a new router instance
const router=express.Router();

/**
 * Route: POST /url
 * Purpose: Create a shortened URL
 * Access: Protected (requires authentication with "user" role)
 * 
 * When client sends POST request to /url:
 * 1. Request goes through authenticateToken middleware (extracts token, sets req.user)
 * 2. Request goes through restrictTo(["user"]) middleware (checks if user has "user" role)
 * 3. If authenticated and authorized, request reaches this route
 * 4. handleCreateShortUrl function is called
 * 5. Function creates short URL in database and returns response
 * 
 * Request headers required:
 * {
 *   "Authorization": "Bearer <JWT_TOKEN>",
 *   "Content-Type": "application/json"
 * }
 * 
 * Request body example:
 * {
 *   "url": "https://www.example.com/very/long/url/path"
 * }
 * 
 * Response example:
 * {
 *   "id": "abc123xyz"
 * }
 */
router.post("/",handleCreateShortUrl);

// Export the router so it can be used in index.js
module.exports=router;

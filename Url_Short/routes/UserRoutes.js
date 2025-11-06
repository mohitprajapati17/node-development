/**
 * ============================================
 * USER ROUTES (routes/UserRoutes.js)
 * ============================================
 * Defines routes for user authentication (signup and login).
 * These routes are public - no authentication required.
 */

// Import Express Router - creates modular route handlers
const express=require("express");

// Import controller functions - these contain the actual logic
const {handleCreateUser,handleLogin}=require("../controllers/UserControllers");

// Create a new router instance
// Router allows us to group related routes together
const router=express.Router();

/**
 * Route: POST /user/signup
 * Purpose: Create a new user account
 * Access: Public (no authentication required)
 * 
 * When client sends POST request to /user/signup:
 * 1. Request goes through authenticateToken middleware (sets req.user = null)
 * 2. Request reaches this route
 * 3. handleCreateUser function is called
 * 4. Function creates user in database and returns response
 * 
 * Request body example:
 * {
 *   "email": "user@example.com",
 *   "username": "johndoe",
 *   "password": "mypassword123",
 *   "role": "user"  // optional, defaults to "user"
 * }
 */
router.post("/signup",handleCreateUser);

/**
 * Route: POST /user/login
 * Purpose: Authenticate user and get JWT token
 * Access: Public (no authentication required)
 * 
 * When client sends POST request to /user/login:
 * 1. Request goes through authenticateToken middleware (sets req.user = null)
 * 2. Request reaches this route
 * 3. handleLogin function is called
 * 4. Function verifies credentials and returns JWT token
 * 
 * Request body example:
 * {
 *   "email": "user@example.com",
 *   "password": "mypassword123"
 * }
 * 
 * Response example:
 * {
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "user@example.com",
 *     "username": "johndoe",
 *     "role": "user"
 *   }
 * }
 */
router.post("/login",handleLogin);

// Export the router so it can be used in index.js
module.exports=router;
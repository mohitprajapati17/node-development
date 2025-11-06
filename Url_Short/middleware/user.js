/**
 * ============================================
 * AUTHENTICATION MIDDLEWARE (middleware/user.js)
 * ============================================
 * Middleware functions that run before route handlers.
 * They check authentication and authorization (permissions).
 */

// Import getUser function from auth service - used to verify JWT tokens
const {getUser}=require("../service/auth");

/**
 * Middleware: Authenticate Token
 * 
 * This runs on EVERY request (registered in index.js with app.use(authenticateToken))
 * 
 * How it works:
 * 1. Checks if request has Authorization header with Bearer token
 * 2. If yes, extracts token and verifies it
 * 3. If token is valid, sets req.user with user data
 * 4. If no token or invalid token, sets req.user to null
 * 5. Always calls next() to continue to next middleware/route
 * 
 * Note: This doesn't block requests - it just sets req.user
 *       Actual blocking is done by restrictTo() middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function (calls next middleware/route)
 */
function  authenticateToken(req,res,next){
    // Extract Authorization header from request
    // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authorizationHeaderValue=req.headers["authorization"];
    
    // Initialize req.user as null (no user authenticated by default)
    req.user=null;
    
    // Check if Authorization header exists and has correct format
    // If no header OR header doesn't start with "Bearer ", skip authentication
    // This allows public routes (like /user/login) to work without tokens
    if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
        // No token provided - continue to next middleware/route
        // req.user stays null (user is not authenticated)
        return next();
    }
    
    // Extract token from "Bearer <token>" format
    // Split by "Bearer " and take the second part (index 1)
    // Example: "Bearer abc123" -> ["Bearer ", "abc123"] -> "abc123"
    const token=authorizationHeaderValue.split("Bearer ")[1];
    
    // Verify token and get user data
    // getUser() returns user object if token is valid, null if invalid
    const user=getUser(token);
    
    // Attach user data to request object
    // If token was valid, req.user contains {id, email, role}
    // If token was invalid, req.user is null
    req.user=user;
    
    // Continue to next middleware or route handler
    return next();
}

/**
 * Middleware Factory: Restrict to specific roles
 * 
 * This is a middleware factory - it returns a middleware function
 * 
 * Usage: restrictTo(["user"]) or restrictTo(["admin"]) or restrictTo(["user", "admin"])
 * 
 * How it works:
 * 1. Checks if req.user exists (user is authenticated)
 * 2. If not authenticated, returns 401 Unauthorized
 * 3. If authenticated, checks if user's role is in allowed roles array
 * 4. If role not allowed, returns 403 Forbidden
 * 5. If role is allowed, continues to route handler
 * 
 * @param {Array} roles - Array of allowed roles (e.g., ["user"], ["admin"], ["user", "admin"])
 * 
 * @returns {Function} - Middleware function that can be used in routes
 * 
 * Example:
 * app.use("/url", restrictTo(["user"]), urlRoutes);
 * This means only users with role "user" can access /url routes
 */
function  restrictTo(roles){
    // Return a middleware function
    return (req,res,next)=>{
        // Check if user is authenticated
        // req.user is set by authenticateToken middleware
        if(!req.user) {
            // User is not authenticated - return 401 Unauthorized
            // This means: "You need to login first"
            return res.status(401).json({error: "Unauthorized"});
        }
        
        // Check if user's role is in the allowed roles array
        // Example: if roles = ["user"] and req.user.role = "admin", this fails
        // Example: if roles = ["user"] and req.user.role = "user", this passes
        if(!roles.includes(req.user.role)) {
            // User is authenticated but doesn't have required role
            // Return 403 Forbidden - "You don't have permission"
            return res.status(403).json({error: "Forbidden"});
        }
        
        // User is authenticated AND has required role
        // Continue to the route handler
        next();
    };
}

// Export both middleware functions
module.exports={authenticateToken,restrictTo};
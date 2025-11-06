/**
 * ============================================
 * MAIN SERVER ENTRY POINT (index.js)
 * ============================================
 * This is the heart of your application - it sets up Express server,
 * connects to database, and routes all incoming requests.
 */

// Import Express framework - handles HTTP requests and responses
const express=require("express");

// Import database connection function
const {connectToMongoose}=require("./connection");

// Import route handlers - these define what happens at different URLs
const urlRoutes=require("./routes/urlRoutes");      // Handles URL shortening routes
const userRoutes=require("./routes/UserRoutes")     // Handles user authentication routes

// Import middleware functions - these run before requests reach route handlers
const {authenticateToken,restrictTo}=require("./middleware/user");

// Import cookie parser - allows reading cookies from requests (currently not used for auth)
const cookieParser=require("cookie-parser");

// Create Express application instance
// This is your web server - it listens for HTTP requests
const app=express();

// ============================================
// MIDDLEWARE SETUP (runs for EVERY request)
// ============================================

// Middleware: Parse JSON request bodies
// When client sends JSON data (like {"email":"user@example.com"}), 
// this converts it to a JavaScript object and puts it in req.body
app.use(express.json());

// Middleware: Parse cookies from request headers
// Extracts cookies and makes them available in req.cookies
app.use(cookieParser());

// Middleware: Authenticate user on every request
// This runs BEFORE routes - checks if user has valid JWT token
// If token is valid, it sets req.user with user info
// If no token or invalid token, req.user stays null (but request continues)
app.use(authenticateToken);

// ============================================
// DATABASE CONNECTION
// ============================================
// Connect to MongoDB database
// This returns a Promise - we handle success with .then() and errors with .catch()
connectToMongoose("mongodb://127.0.0.1:27017/url_shortener")
.then(()=>{
    // Success callback - runs when connection is established
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    // Error callback - runs if connection fails
    console.log("MongoDB connection error:", err)
});

// ============================================
// ROUTE REGISTRATION
// ============================================
// Register routes with their middleware and handlers

// Route: /url/* (URL shortening endpoints)
// Middleware: restrictTo(["user"]) - only allows users with "user" role
// Handler: urlRoutes - handles POST /url to create short URLs
app.use("/url", restrictTo(["user"]),urlRoutes);

// Route: /user/* (User authentication endpoints)
// No role restriction - anyone can signup/login
// Handler: userRoutes - handles POST /user/signup and POST /user/login
app.use("/user", userRoutes);

// ============================================
// START SERVER
// ============================================
// Start listening for HTTP requests on port 3000
// When server is ready, callback function runs
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
});

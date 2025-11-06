# Complete Code Flow Explanation

## 🏗️ Architecture Overview

Your application follows the **MVC (Model-View-Controller)** pattern with additional layers:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  - Sends HTTP requests with JWT token in Authorization   │
│  - Stores token in localStorage                          │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (index.js)                   │
│  1. Parse JSON bodies                                    │
│  2. Authenticate token (middleware)                      │
│  3. Route to appropriate handler                          │
└────────────────────┬──────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐        ┌───────────────┐
│   ROUTES      │        │  MIDDLEWARE    │
│  - UserRoutes │        │ - authenticateToken│
│  - urlRoutes  │        │ - restrictTo()    │
└───────┬───────┘        └─────────────────┘
        │
        ▼
┌───────────────┐
│ CONTROLLERS  │
│ - Handle logic│
│ - Database ops│
└───────┬───────┘
        │
        ▼
┌───────────────┐        ┌───────────────┐
│    MODELS     │        │   SERVICES    │
│ - User Schema │        │ - JWT tokens  │
│ - Url Schema  │        │ - bcrypt      │
└───────┬───────┘        └───────────────┘
        │
        ▼
┌───────────────┐
│   MONGODB     │
│   Database    │
└───────────────┘
```

---

## 🔄 Complete Request Flow

### **Scenario 1: User Signup Flow**

```
1. CLIENT sends POST request
   POST http://localhost:3000/user/signup
   Body: {
     "email": "user@example.com",
     "username": "johndoe",
     "password": "mypassword123",
     "role": "user"
   }

2. EXPRESS SERVER (index.js)
   ├─ express.json() middleware
   │  └─ Parses JSON body → req.body = {email, username, password, role}
   │
   ├─ authenticateToken middleware
   │  └─ No token provided → req.user = null
   │
   └─ Routes to /user → UserRoutes

3. USER ROUTES (routes/UserRoutes.js)
   ├─ Matches POST /signup
   └─ Calls handleCreateUser() controller

4. USER CONTROLLER (controllers/UserControllers.js)
   ├─ Extract data: {email, username, password, role} from req.body
   ├─ Hash password: bcrypt.hash(password, 10) → hashedPassword
   ├─ Validate: Check if email, username, password exist
   ├─ Create user: User.create({email, password: hashedPassword, username, role})
   │  └─ This calls MongoDB to insert document
   │
   └─ Return response: {message: "User created successfully"}

5. RESPONSE sent back to client
   Status: 201 Created
   Body: {message: "User created successfully"}
```

---

### **Scenario 2: User Login Flow**

```
1. CLIENT sends POST request
   POST http://localhost:3000/user/login
   Body: {
     "email": "user@example.com",
     "password": "mypassword123"
   }

2. EXPRESS SERVER (index.js)
   ├─ express.json() middleware
   │  └─ Parses JSON body → req.body = {email, password}
   │
   ├─ authenticateToken middleware
   │  └─ No token provided → req.user = null
   │
   └─ Routes to /user → UserRoutes

3. USER ROUTES (routes/UserRoutes.js)
   ├─ Matches POST /login
   └─ Calls handleLogin() controller

4. USER CONTROLLER (controllers/UserControllers.js)
   ├─ Extract data: {email, password} from req.body
   ├─ Find user: User.findOne({email}) → user document
   ├─ Check user exists: if (!user) → return error
   ├─ Compare password: bcrypt.compare(password, user.password) → true/false
   ├─ If password matches:
   │  ├─ Create token: setUser(user, user._id, user.role)
   │  │  └─ Calls service/auth.js → creates JWT token
   │  │
   │  └─ Return response with token
   └─ If password doesn't match → return error

5. AUTH SERVICE (service/auth.js) - if login succeeds
   ├─ setUser() function called
   ├─ Create payload: {id: user._id, email: user.email, role: user.role}
   ├─ Sign token: jsonwebtoken.sign(payload, JWT_SECRET)
   └─ Return token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

6. RESPONSE sent back to client
   Status: 200 OK
   Body: {
     message: "Login successful",
     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     user: {id, email, username, role}
   }

7. CLIENT stores token
   localStorage.setItem('jwt', token)
```

---

### **Scenario 3: Create Short URL Flow (Protected Route)**

```
1. CLIENT sends POST request
   POST http://localhost:3000/url
   Headers: {
     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "Content-Type": "application/json"
   }
   Body: {
     "url": "https://www.example.com/very/long/url/path"
   }

2. EXPRESS SERVER (index.js)
   ├─ express.json() middleware
   │  └─ Parses JSON body → req.body = {url: "https://..."}
   │
   ├─ authenticateToken middleware
   │  ├─ Extract header: req.headers["authorization"]
   │  ├─ Check format: "Bearer <token>"
   │  ├─ Extract token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   │  ├─ Verify token: getUser(token) from service/auth.js
   │  │  └─ jsonwebtoken.verify(token, JWT_SECRET) → {id, email, role}
   │  │
   │  └─ Set req.user = {id, email, role}
   │
   ├─ Routes to /url → urlRoutes
   │
   └─ restrictTo(["user"]) middleware
      ├─ Check req.user exists → Yes (user is authenticated)
      ├─ Check req.user.role in ["user"] → Yes (role matches)
      └─ Continue to route handler

3. URL ROUTES (routes/urlRoutes.js)
   ├─ Matches POST /
   └─ Calls handleCreateShortUrl() controller

4. URL CONTROLLER (controllers/urlControllers.js)
   ├─ Extract data: {url} from req.body
   ├─ Validate: Check if url exists
   ├─ Generate short ID: shortid() → "abc123xyz"
   ├─ Create URL: Url.create({
   │     url: "abc123xyz",
   │     redirectUrl: "https://www.example.com/very/long/url/path",
   │     visitHistory: []
   │   })
   │  └─ This calls MongoDB to insert document
   │
   └─ Return response: {id: "abc123xyz"}

5. RESPONSE sent back to client
   Status: 200 OK
   Body: {id: "abc123xyz"}
```

---

### **Scenario 4: Unauthorized Request Flow**

```
1. CLIENT sends POST request WITHOUT token
   POST http://localhost:3000/url
   Body: {url: "https://example.com"}

2. EXPRESS SERVER (index.js)
   ├─ express.json() middleware
   ├─ authenticateToken middleware
   │  └─ No Authorization header → req.user = null
   │
   └─ Routes to /url → urlRoutes
      └─ restrictTo(["user"]) middleware
         ├─ Check req.user exists → No (req.user is null)
         └─ Return 401 Unauthorized

3. RESPONSE sent back to client
   Status: 401 Unauthorized
   Body: {error: "Unauthorized"}
```

---

## 🔐 Authentication & Authorization Flow

### **Authentication (Who are you?)**
- **Middleware**: `authenticateToken()`
- **Location**: Runs on EVERY request (in index.js)
- **Purpose**: Verifies JWT token and identifies the user
- **Result**: Sets `req.user` with user data if token is valid

### **Authorization (What can you do?)**
- **Middleware**: `restrictTo(roles)`
- **Location**: Applied to specific routes (like `/url`)
- **Purpose**: Checks if authenticated user has required role
- **Result**: Blocks request if user doesn't have required role

---

## 📁 File Responsibilities

### **index.js** - Main Server
- Sets up Express app
- Configures middleware
- Connects to database
- Registers routes
- Starts server

### **connection.js** - Database
- Handles MongoDB connection
- Returns connection promise

### **models/** - Data Structure
- Define database schemas
- Create Mongoose models
- Enforce data validation

### **routes/** - URL Mapping
- Map URLs to controller functions
- Define which routes are public/protected

### **controllers/** - Business Logic
- Handle request processing
- Database operations
- Validation
- Return responses

### **middleware/** - Request Processing
- Run before routes
- Authentication checks
- Authorization checks

### **service/** - Utilities
- JWT token creation/verification
- Reusable functions

---

## 🔑 Key Concepts

### **1. Middleware Chain**
```
Request → express.json() → authenticateToken → restrictTo() → Controller → Response
```

### **2. JWT Token Lifecycle**
```
Login → Create Token → Store in localStorage → Send with every request → Verify on server
```

### **3. Password Security**
```
Signup: Plain password → bcrypt.hash() → Hashed password stored
Login: Plain password + Hashed password → bcrypt.compare() → True/False
```

### **4. Protected Routes**
```
Public: /user/signup, /user/login (no authentication needed)
Protected: /url/* (requires authentication + role check)
```

---

## 🎯 Summary

Your backend follows a clean architecture:
1. **Client** sends requests with/without JWT token
2. **Middleware** checks authentication on every request
3. **Routes** map URLs to controllers
4. **Controllers** handle business logic and database operations
5. **Models** define data structure
6. **Services** provide utility functions

The code is well-organized, secure (password hashing, JWT tokens), and follows best practices!


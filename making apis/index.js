const express=require("express");
const {connectToMongoDB}=require("./connection");

const app=express();

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Connect to MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/users")
.then(()=>{console.log("Connected to MongoDB")})
.catch((err)=>{console.log("MongoDB connection error:", err)});

const router=require("./routes/userRoutes");

// Routes
app.use("/users",router);

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
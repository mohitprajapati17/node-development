const express=require("express");
const {connectToMongoose}=require("./connection");
const urlRoutes=require("./routes/urlRoutes");
const userRoutes=require("./routes/UserRoutes")
const {authenticateToken,restrictTo}=require("./middleware/user");
const cookieParser=require("cookie-parser");
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(authenticateToken);
connectToMongoose("mongodb://127.0.0.1:27017/url_shortener")
.then(()=>{console.log("Connected to MongoDB")})
.catch((err)=>{console.log("MongoDB connection error:", err)});

app.use("/url", restrictTo(["user"]),urlRoutes);
app.use("/user", userRoutes);


app.listen(3000,()=>{console.log("Server is running on port 3000")});

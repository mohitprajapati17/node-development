const express=require("express");
const {connectToMongoose}=require("./connection");
const urlRoutes=require("./routes/urlRoutes");
const app=express();
app.use(express.json());

connectToMongoose("mongodb://127.0.0.1:27017/url_shortener")
.then(()=>{console.log("Connected to MongoDB")})
.catch((err)=>{console.log("MongoDB connection error:", err)});

app.use("/url",urlRoutes);


app.listen(3000,()=>{console.log("Server is running on port 3000")});

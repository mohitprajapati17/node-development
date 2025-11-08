const express =require("express");
const app=express();
const port  =3000;
const userRoutes=require("./routes/userRoutes");
const mongoose=require("mongoose");
const commentRoutes=require("./routes/commentRoutes");
const blogRoutes=require("./routes/blogRoutes");
const {authorize,restricTo}=require("./middlewares/authorize");
mongoose.connect("mongodb://127.0.0.1:27017/blog_app").then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("MongoDB connection error:", err);
});


app.use(express.json());
app.use("/users",userRoutes);

app.use("/blogs",authorize,restricTo(["user"]),blogRoutes);
app.use("/blogs/:blogId/comments",authorize,restricTo(["user"]),commentRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

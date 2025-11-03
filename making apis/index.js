const data=require("./mockdata.json");
const express=require("express");
const mongoose=require("mongoose");

const app=express();
const fs=require("fs");
// middleware
const users=require("./mockdata.json");
app.use(express.urlencoded({extended:true}));



// Middleware to parse JSON request bodies
app.use(express.json());

// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/users")
.then(()=>{console.log("connected to mongodb")}).catch((err)=>{console.log(err)});

const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        required:true,
        unique:true,
        type:String,
    },
    gender:{
        type:String,
        

    },

});

const User =mongoose.model("user",userSchema);

app.get("/data",async(req,res)=>{
    const result=await User.find();
    res.status(200).json(result);
})

app.get("/data/:id",async(req,res)=>{
    const id=req.params.id;
    const result=await User.findById(id);
    res.status(200).json(result);
})

app.post("/data",async(req,res)=>{
    const body=req.body;
   
    const result=await User.create(body);
    console.log(result);
    res.status(201).json(result);


})

app.patch("/data/:id",async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const result =await User.findByIdAndUpdate(id,body,{new:true});
    res.status(200).json(result);
})



const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
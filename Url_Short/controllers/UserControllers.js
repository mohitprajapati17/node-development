const {User}=require("../models/users");
const {v4:uuidv4}=require("uuid");
const {setUser}=require("../service/auth");
async function handleCreateUser(req,res){
    const {email, password, username}=req.body;
    if(!email || !password || !username) return res.status(400).json({error: "All fields are required"});
    await User.create({email,password,username});
    return res.status(201).json({message: "User created successfully"});
}

async function handleLogin(req,res){
    const {email,password}  =req.body;
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({error: "User not found"});
    const isMatch=user.password===password;
    const token=setUser(user);

    res.cookie("uid",token);
    if(!isMatch) return res.status(400).json({error: "Invalid password"});
    return res.status(200).json({message: "Login successful"});
}

module.exports={handleCreateUser,handleLogin};

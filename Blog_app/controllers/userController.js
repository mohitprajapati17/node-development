const {User}=require("../model/users"); 
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {createToken,verifyToken}=require("../jwtUtil.js/jwt");

async function handleUserSignup(req,res){
    const {fullname, email, password, role, profileImage}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({fullname,email,password:hashedPassword,role,profileImage});
    res.status(201).json({user});

}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({error:"User not found"});
    }
    const isMatch =await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({error:"Invalid password"});
    }

    const token=createToken(user,user._id,user.role);
    res.status(200).json({message:"Login successful",token});

}



module.exports={handleUserSignup,handleUserLogin};
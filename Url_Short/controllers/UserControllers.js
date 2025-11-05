const {User}=require("../models/users");
const {v4:uuidv4}=require("uuid");
const bcrypt=require("bcrypt");
const {setUser}=require("../service/auth");
async function handleCreateUser(req,res){
    const {email, username, password,role}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    if(!email || !password || !username) return res.status(400).json({error: "All fields are required"});
    await User.create({email,password:hashedPassword,username,role});
    return res.status(201).json({message: "User created successfully"});
}

async function handleLogin(req,res){
    const {email,password,role}  =req.body;


    const user=await User.findOne({email});
    if(!user) return res.status(400).json({error: "User not found"});
    const isMatch=await bcrypt.compare(password, user.password);

    if(!isMatch) return res.status(400).json({error: "Invalid password"});
    const token=setUser(user, user._id, user.role || role);

    // Return token to client - client will store it in localStorage
    return res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }
    });
}

module.exports={handleCreateUser,handleLogin};

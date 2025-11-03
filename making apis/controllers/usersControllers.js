const {User}=require("../model/users");

async function getAllUsers(req,res){
    const result=await User.find();
    res.status(200).json(result);
    return await result
}

async function getUserById(req,res){
    const id=req.params.id;
    const result=await User.findById(id);
    res.status(200).json(result);
  
}

async function createUser(req,res){
    const result=await User.create(req.body);
    res.status(201).json(result);
}
async function updateUser(req,res){
    const id=req.params.id;
    const result=await User.findByIdAndUpdate(id,req.body,{new:true});;
     res.status(200).json(result);
}

async function deleteUser(req,res){
    const id=req.params.id;
    const result=await User.findByIdAndDelete(id);
    res.status(200).json(result);
    
}

module.exports={getAllUsers,getUserById,createUser,updateUser,deleteUser};
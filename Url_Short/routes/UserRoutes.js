const express=require("express");
const {handleCreateUser,handleLogin}=require("../controllers/UserControllers");

const router=express.Router();

router.post("/signup",handleCreateUser);
router.post("/login",handleLogin);

module.exports=router;
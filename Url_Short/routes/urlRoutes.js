const express=require("express");
const {handleCreateShortUrl}=require("../controllers/urlControllers");

const router=express.Router();

router.post("/",handleCreateShortUrl);

module.exports=router;

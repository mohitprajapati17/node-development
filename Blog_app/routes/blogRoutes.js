const express=require("express");
const {handleCreateBlog,showAllBlogs,updateBlog,deleteBlog,getBlogById}=require("../controllers/BlogController");
const router=express.Router();

router.post("/",handleCreateBlog);
router.get("/",showAllBlogs);
router.put("/:id",updateBlog);
router.delete("/:id",deleteBlog);
router.get("/:id",getBlogById);

module.exports=router;
const express=require("express");
const {CreateComment,getCommentsByBlogId,updateComment,deleteComment}=require("../controllers/comments");
const router=express.Router();

router.post("/:id",CreateComment);
router.get("/:id",getCommentsByBlogId);
router.put("/:id",updateComment);
router.delete("/:id",deleteComment);

module.exports=router;
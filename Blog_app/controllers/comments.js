const {Comment}=require("../model/comments");

async function CreateComment(req,res){
    const blogId=req.params.id;
    const {content }=req.body;
    const author=req.user.id;
    const comment =await Comment.create({content,createdBy:author,blog:blogId});
    await comment.populate('createdBy', 'fullname email');
    res.status(201).json({comment});
}

async function getCommentsByBlogId(req,res){
    const blogId=req.params.id;
    const comments= await  Comment.find({blog:blogId }).populate('createdBy', 'fullname ');
    res.status(200).json({comments});
}

async function updateComment(req,res){
    const commentId=req.params.id;
    const  userId=req.user?.id;
    const comment=await Comment.findById(commentId);
    if(!userId?.equals(comment?.createdBy)){
        return res.status(403).json({error:"You are not authorized to update this comment"});
    }

    
    const updatedComment=await  Comment.findByIdAndUpdate(commentId,req.body, {new:true});
    res.status(200).json({updatedComment});

    
}


async  function deleteComment (req,res){
    const commentId=req.params.id;
    const userId=req.user?.id;
    const comment=await Comment.findById(commentId);
    if(!userId?.equals(comment?.createdBy)){
        return res.status(403).json({error:"You are not authorized to delete this comment"});
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({message:"Comment deleted successfully"});
}

module.exports={CreateComment,getCommentsByBlogId,updateComment,deleteComment};
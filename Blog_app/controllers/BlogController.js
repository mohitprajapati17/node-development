const {Blog}=require("../model/blog");

async function handleCreateBlog(req,res){
    const {title,body,createdBy,post,updatedAt,createdAt}=req.body;
    const author=req.user;
    const blog=await Blog.create({title,body,createdBy:author.id,post,updatedAt,createdAt});
    await blog.populate('createdBy', 'fullname email');  // Populate after creation

    res.status(201).json({blog});
}

async function showAllBlogs(req,res){
    const blogs=await Blog.find();
    res.status(200).json({blogs});
}

async function updateBlog(req,res){
    const id=req.params.id;
    const blog =await Blog.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json({blog});
}

async  function deleteBlog(req,res){
    const id=req.params.id;
    const blog =await Blog.findByIdAndDelete(id);
    res.status(200).json({blog});
}

async function getBlogById(req,res){
    const id=req.params.id;
    const blog =await Blog.findById(id);
    res.status(200).json({blog});
}

module.exports={handleCreateBlog,showAllBlogs,updateBlog,deleteBlog,getBlogById};

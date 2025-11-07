const {Schema , model}= require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    createdBy:{
     type:Schema.Types.ObjectId,
     ref:"user",

    },  
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    post:{
        type:String,

    },
    },
    {timestamps:true},
)

const Blog=model("blog",blogSchema);
module.exports={Blog};

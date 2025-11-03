const mongoose=require("mongoose");

const urlSchema =new mongoose.Schema({
    url:{
        type:String,
        required:true,
        unique:true,
    },
    redirectUrl:{
        type:String,
        required:true,
    },
    visitHistory:[{timestamps:Number}],
})

const Url=mongoose.model("url",urlSchema);
module.exports={Url};
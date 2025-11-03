const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        required:true,
        unique:true,
        type:String,
    },
    gender:{
        type:String,
        

    },

});

const User =mongoose.model("user",userSchema);
module.exports={User};
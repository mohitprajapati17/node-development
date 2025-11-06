const {Schema,model}=require("mongoose");

const userSchema  =new Schema({
    fullname:{
        type:String,
        required:true,
        

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    password:{
        type:String,
        required:true,
    },
    role:{
        type :String,
        enum:["user","admin"],
        default:"user",
    }
    ,
    profileImage:{
        type:String,
        default:"../public/images.png",

    }
    



},
       {timestamps:true},
)

const User=model("user",userSchema);
module.exports={User};
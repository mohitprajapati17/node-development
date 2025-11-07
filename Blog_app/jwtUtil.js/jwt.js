const jwt=require("jsonwebtoken");
const JWT_SECRET="mysecretkey";

function createToken(user,id,role){
    const payload={
        id,
        email:user.email,
        role:user.role,
    }
    const token =jwt.sign(payload,JWT_SECRET);
    return token;
}

function verifyToken(token){
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        return decoded;
    }catch(error){
        console.error(error);
        return null;
    }
}

module.exports={createToken,verifyToken};
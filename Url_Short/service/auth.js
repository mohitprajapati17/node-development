
const jsonwebtoken=require("jsonwebtoken");
const JWT_SECRET="mysecretkey";
function setUser(user, id, role){
    
    const payload={id,email:user.email,role};
    const token= jsonwebtoken.sign(payload,JWT_SECRET);
    return token;

}

function getUser(token){
    try{
        return jsonwebtoken.verify(token,JWT_SECRET);
    }catch(error){
        console.error(error);
        return null;
    }
}

module.exports={setUser,getUser};

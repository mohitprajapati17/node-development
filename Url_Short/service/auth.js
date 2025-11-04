const sessionIdToUser=new Map();
const jsonwebtoken=require("jsonwebtoken");
const JWT_SECRET="mysecretkey";
function setUser(user, id){
    const payload={id,email:user.email};
    return jsonwebtoken.sign(payload,JWT_SECRET);

}

function getUser(token){
    return jsonwebtoken.verify(token,JWT_SECRET);
}

module.exports={setUser,getUser};

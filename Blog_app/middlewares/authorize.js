const {verifyToken}=require("../jwtUtil.js/jwt");

function authorize(req,res,next){
    let token=req.headers.authorization;
    if(!token||!token.startsWith("Bearer ")){
        return res.status(401).json({error:"go login first"});
    }

    token=token.split(" ")[1];

    try{
        const decoded=verifyToken(token);
        console.log(decoded);
        
        req.user=decoded;
        next();
    }catch(error){
        return res.status(401).json({error:"invalid token"});
    }
    
}

function restricTo(roles){
    return  (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error:"you are not authorized to access this resource"});
        }
        next();
    }
}

module.exports={authorize,restricTo};
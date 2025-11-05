const {getUser}=require("../service/auth");

function  authenticateToken(req,res,next){
    const authorizationHeaderValue=req.headers["authorization"];
    req.user=null;
    if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) return next();
    const token=authorizationHeaderValue.split("Bearer ")[1];
    const user=getUser(token);
    req.user=user;
    return next();

}

function  restrictTo(roles){
    return(req,res,next)=>{
        if(!req.user) return res.status(401).json({error: "Unauthorized"});
        if(!roles.includes(req.user.role)) return res.status(403).json({error: "Forbidden"});
        next();
    }

}


module.exports={authenticateToken,restrictTo};
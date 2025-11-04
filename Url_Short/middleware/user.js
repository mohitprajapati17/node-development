const {getUser}=require("../service/auth");


async function restrictToLoggedInUser(req,res,next){
    const uid=req.cookies.uid;
    if(!uid) return res.redirect("/login");
    const user=getUser(uid);
    if(!user) return res.redirect("/login");
    req.user=user;
    next();
}

async function isAuthenticated(req,res,next){
    const user=req.user;
    if(!user) return res.redirect("/login");
    next();
}


module.exports={restrictToLoggedInUser,isAuthenticated};
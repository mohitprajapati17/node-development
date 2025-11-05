const express=require("express");
const {Url}=require("../models/urls");
const shortid=require("shortid");



async function handleCreateShortUrl(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error: "url is required"});
    const shortId=shortid();
    await Url.create({
        url:shortId,
        redirectUrl:body.url,
        visitHistory:[]
    })
    return res.json({id:shortId});

}




module.exports={handleCreateShortUrl};
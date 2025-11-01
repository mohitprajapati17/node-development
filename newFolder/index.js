const http=require("http");
const fs=require("fs");
const express=require("express");

const app=express();
app.get("/",(req, res)=>{
    res.send("home page");
});
app.get("/about",(req, res)=>{
    res.send("about page");
});
app.get("/contact",(req, res)=>{
    res.send("contact page");
});
app.get("*",(req, res)=>{
    res.send("404 page");
});

const server=http.createServer(app);

server.listen(3000,()=>{console.log("Server is started")});

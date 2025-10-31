const http=require("http");
const fs=require("fs");
const server=http.createServer((req , res)=>{
    const log=`${new Date().toLocaleTimeString()} : ${req.url} : received request \n`;
    
    fs.appendFile("log.txt",log,(err)=>{
        switch(req.url){
            case "/": res.end("home page");
                break;
            case "/about": res.end("about page");
                break;
            case "/contact": res.end("contact page");
                break;
            default: res.end("404 page");
                break;
        }
        console.log(data);

    })
})



server.listen(3000,()=>{console.log("Server is started")});


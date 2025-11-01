const data=require("./mockdata.json");
const express=require("express");

const app=express();
const fs=require("fs");
// middleware
const users=require("./mockdata.json");
app.use(express.urlencoded({extended:true}));

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/data",(req,res)=>{
    res.send(data);
})

app.get("/data/:id",(req,res)=>{
    const id=req.params.id;
    const user=data.find((user)=>user.id===parseInt(id));
    res.send(user);
})

app.post("/data",(req,res)=>{
    const body=req.body;
    users.push({...body ,id:data.length+1});
    fs.writeFile("./mockdata.json",JSON.stringify(users),(err,data)=>{
        return  res.json({"id ":users.length});
    })

})

app.patch("/data/:id",(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const x=users.map((user)=>user.id===parseInt(id)?{...body,id:id}:user);
    fs.writeFile("./mockdata.json",JSON.stringify(x),(err,data)=>{
        return res.json({"message":"User updated successfully"});
    })
})



const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
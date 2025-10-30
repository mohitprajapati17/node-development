// console.log("Hello World");
// const math = require("./math");
// console.log(math.add(1, 2));

const fs=require("fs");
fs.writeFileSync("hello.txt","my name is mohit");
// const data=fs.readFileSync("hello.txt","utf-8");
// console.log(data);
fs.readFile("hello.txt","utf-8",(err, data)=>{ console.log(data)})
fs.writeFileSync("hello.txt","my name is mohit and always")
fs.appendFile("hello.txt","my class is 10th" ,(err)=>{
    if(err) console.log(err);
    else console.log(new Date().toLocaleTimeString()+" file appended successfully");
});

fs.writeFileSync("mohit.txt","my name is mohit and always my class is 10th");
fs.readFileSync("mohit.txt","utf-8",(err, data)=>{ console.log(data , new Date().toLocaleTimeString())});
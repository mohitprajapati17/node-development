// console.log("Hello World");
// const math = require("./math");
// console.log(math.add(1, 2));
const fs=require("fs");
const os=require("os");
console.log(os.cpus().length)

// Non blocking
console.log("1");
fs.readFile("hello.txt","utf-8",(err, data)=>{ console.log(data)});
console.log("2");

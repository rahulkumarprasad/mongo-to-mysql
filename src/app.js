const express=require("express");
const app=express();
const host="127.0.0.1";
const router=require("./router");
const port=process.env.PORT || 3000;
const path=require("path");
const location=path.join(__dirname,"../templates");
const viewsloc=path.join(location,"/views");
const hbs=require("hbs");
console.log("path= "+viewsloc);
app.use(express.static(location));
app.use(express.urlencoded({extended:false}));
app.use(router);
app.set("view engine","hbs");
app.set("views",viewsloc);
hbs.registerPartials(path.join(location,"/partials"));

app.listen(port,host,() =>{console.log("listening to port these "+host+"@"+port);});

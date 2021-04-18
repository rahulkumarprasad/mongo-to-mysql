const { static } = require("express");
const express=require("express");
const router=express.Router();
const RequestIp = require('@supercharge/request-ip');

var os = require( 'os' );
var networkInterfaces = os.networkInterfaces();
var arr = networkInterfaces['Local Area Connection 3'];

const {mongoConnect,connectMysql}=require("./connection");
const {createMongoSchema,inserttomongod}=require("./phpProcessRequest");
const createPhpSchema=require("./mongoProcessRequest")

router.get("/",(req,res) =>{
 
res.render("index",{title:"Home",datas:["ragul","skathra","japan"]});
});

router.post("/connection",async(req,res)=>{
   try{
   console.log(req.body);
   let mongocon=await mongoConnect(req.body.mongodatabasename,req.body.mongohostname,req.body.mongoport);
   let phpcon=await connectMysql(req.body.phpdatabasename,req.body.phphostname,req.body.phpport,req.body.phpuser,req.body.phppassword);
  console.log(phpcon);
  let a=""
   if(mongocon){
      a+="mongo connected  %%";
   }else{a+=" mongo not connected";}
   if(phpcon){
      a+=" php connected";
   }else{a+="sorry not able to make connection with mysql";}

var result={};

   if(req.body.conversionmethod.trim()=="phptomongo"){
      let idfielddecision=req.body.phpPrimaryKeyOptions;

      if(req.body.phpselecttable.trim()=="phpConvertOnly"){
         let tablesarray=req.body.phptablenames.trim().split(",");
         
         console.log("php table splitted ==");
         console.log(tablesarray);
         
         let schema=await createMongoSchema(phpcon,idfielddecision,tablesarray);
         console.log("main file  tables =="+Object.keys(schema));
         result=await inserttomongod(phpcon,mongocon,schema,idfielddecision,tablesarray);
      }
      else{
      
      let schema=await createMongoSchema(phpcon,idfielddecision);
         console.log("main file  tables =="+Object.keys(schema));
         result=await inserttomongod(phpcon,mongocon,schema,idfielddecision);
      }
   


   }
   else if(req.body.conversionmethod.trim()=="mongotophp"){
let idfielddecision=req.body.mongoPrimaryKeyOptions;
if(req.body.mongoselecttable.trim()=="mongoConvertOnly"){
         let tablesarray=req.body.mongotablenames.trim().split(",");
         console.log("mongo table splitted ==");
         console.log(tablesarray);

         result=await createPhpSchema(mongocon,phpcon,idfielddecision,tablesarray);

      }
      else{  
         result=await createPhpSchema(mongocon,phpcon,idfielddecision);             
      }
   }

   res.send(JSON.stringify({connections_status:a,inserted_result:[result]}));
   }
catch(e){
   console.log("error in router "+e.message);
   res.status(404).send(JSON.stringify({error:true,error_name:e.name,error_message:e.message}));
}

});

router.get("/test/:id",(req,res) =>{
res.send(" the id passed is "+req.params.id)
});

router.get("/requirments",(req,res) =>{
   // console.log(networkInterfaces);
   // let key=Object.keys(networkInterfaces);
   // ip=networkInterfaces[key[1]].address+" or "+(key[2]!=null)?networkInterfaces[key[2]][0].address:"nothing";
   res.render("requirments.hbs",{ title: 'foo' ,path:false,ip:"not available"});
});

module.exports=router;
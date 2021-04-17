const { log } = require("console");
const mongoose=require("mongoose");
const mysql=require("mysql");
const util = require('util');

const mongoConnect= async (dbname,host="localhost",port=27017,username="default",password="admin") =>{
try{    let str=`mongodb://${host}:${port}/${dbname}`;
    if(username!="default"){
        str=`mongodb://${username}:${password}@${host}:${port}/${dbname}`;
    }
 let conn= await mongoose.connect(str,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
});
if(conn){console.log("connecyed mongo db")}
    return conn;
}
catch(e){
    console.log("error in connect mongo fun"+e);
    throw new Error(e);
}
}
const connectMysql=async (dbname,host="localhost",port="3306",user="root",password="")=>{
    try{
        var conn= mysql.createConnection({
        database:dbname,
          host: host,
          user:user,
          password: password,
          port:port
          
        });
        let query = util.promisify(conn.query).bind(conn)
        if(query){
            return query;
        }else{return false}
        
    } 
    catch(e){
    console.log("error in connectmysql fun"+e);
        throw new Error(e);
    }
   

}


module.exports = {mongoConnect,connectMysql};
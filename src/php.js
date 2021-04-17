var mysql=require("mysql");
console.log("started");


async function connectphp(dbname,host="localhost",user="root",password="",port="3306"){ 
  var pool=mysql.createConnection({
 
    host: host,
    user:user,
    password: password,
    port:port
    
   
  });

pool.connect(function (e){
  if(!e){
    console.log("connected ");
  }
  else{
    throw new Error("Php connection failed error ="+e);
  }
})


}
    // con.query("SELECT * FROM vegetables", function (err, result, fields) {
    //   if (err) console.log(err); 
    //   console.log(result);
    // });
  
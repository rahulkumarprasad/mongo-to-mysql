const mongoose=require("mongoose");
//const schema=require("mongoose").model("mensrankings").schema()

const createPhpSchema=async (mongocon,phpcon,idoption,tables=null) =>{
    result={}

   all_collection_of_mongodb=await mongoose.connection.db.listCollections().toArray()

    load_tables_of_mysql=await phpcon("show tables ;");
    console.log(load_tables_of_mysql);
    if(load_tables_of_mysql != null){
   // console.log("kad"+Object.keys(load_tables_of_mysql[0]));
    mysql_table_array=[];
    for(i in load_tables_of_mysql){
        mysql_table_array.push(load_tables_of_mysql[i][Object.keys(load_tables_of_mysql[i])])
    }  
} 
    // waiting for the table to load 
    for(index in all_collection_of_mongodb)
{           
    if((Array.isArray(tables) && !tables.includes(all_collection_of_mongodb[index]["name"])) || mysql_table_array.includes(all_collection_of_mongodb[index]["name"]) )
    {  continue; }
        console.log("table name == "+all_collection_of_mongodb[index]["name"]);

    let query="";
    let columns="";
    let model=await mongoose.model(all_collection_of_mongodb[index]["name"],new mongoose.Schema({_id:String}));
    let res=await model.find({},{__v:false});
   
    if(res!=null && res.length!=0){
        console.log("If statment executed=================");
    check_for_max_column=[];
    for(i in res){
    temp=Object.keys(res[i].toJSON());
    console.log(res[i]);
    detail={"index":i,"count":temp.length};
    check_for_max_column.push(detail);
        }
    
    max_rows_index=check_for_max_column.sort((a,b) =>{return b.count - a.count})[0]
    
    data=res[max_rows_index.index].toJSON();
    for(i in data){
        console.log(i+" == "+typeof(data[i]));
        if(i=="_id"){
            if(idoption=="true"){
            columns=" id int(60) unsigned auto_increment primary key, temp varchar(100), ";
            }
            else{
                columns=" id varchar(500) not null primary key, ";
            }
        }
        else if(typeof(data[i]) == "string"){
            columns+=" "+i+" varchar(100) ,"
        }
        else if(typeof(data[i]) == "number"){
            columns+=" "+i+" int(50) ,"
        }else if(typeof(data[i]) == "boolean"){
            columns+=" "+i+" boolean ,"
        }
       
        else{ columns+=" "+i+" mediumtext ,"}

    }
    
    columns=columns.slice(0,-1);
    console.log(columns);
    query=" create table if not exists "+all_collection_of_mongodb[index]["name"]+" ("+columns+") ;";
    phptablecreation=await phpcon(query);
    console.log(phptablecreation);
    if(phptablecreation){
        allDataFromMongoDb=await model.find({},{__v:false});
        console.log(Object.values(allDataFromMongoDb[0].toJSON()));
        
        keys=[];
        let temp=columns.split(",");
        for(i in temp)
        {  keys.push(temp[i].trim().split(" ")[0]); }

        if(idoption=="true"){
        keys=keys.slice(1);
        }
        keys=keys.join(",");
        console.log(keys);
        // if(idoption=="true"){
        // keys=Object.keys(allDataFromMongoDb[0].toJSON())
        // keys[0]="temp";
        //  }
        // else{keys=Object.keys(allDataFromMongoDb[0].toJSON()).slice(1)}
        
        query=`insert into ${all_collection_of_mongodb[index]["name"]} (${keys}) values ${allDataFromMongoDb.map((item) =>{ let values=Object.values(item.toJSON()); let new_values=[]; for(a in values){ if (values[a] !=null && isNaN(values[a]) && !Array.isArray(values[a]) ) {new_values.push(values[a].replace(/'/g," ")) } else if(Array.isArray(values[a])){ new_values.push(JSON.stringify(values[a]));} else{ new_values.push(values[a])} } let diff=(keys.split(",")).length-new_values.length; console.log("diff==" +diff); if(diff>0){ for(let i=0;i<diff;i++){new_values.push("")}} console.log("new value is == "+new_values);  return "('"+ new_values.join("','") +"')"; })}`;

        console.log(query);
        res=await phpcon(query);
        console.log(res);
        result[all_collection_of_mongodb[index]["name"]]=res;

    }

}

}

return result;
//wait of mysql table end

    //console.log(typeof res[0].image1);

};

module.exports=createPhpSchema;
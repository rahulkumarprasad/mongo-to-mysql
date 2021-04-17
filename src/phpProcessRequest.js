
const  mongoose=require("mongoose");
const createMongoSchema=async (phpcon,idfield,tables=null)=>{
 
    let alltables=await phpcon("show tables");
         let j=0;
         let alltablesschema={};
         for(element in alltables){
            let key=Object.keys(alltables[element]);
             if(Array.isArray(tables) && !tables.includes(alltables[element][key]))
             { continue;}
               let tableFieldsForQuery="";
               let primaryKey="";
             console.log("abakjsbajsd=="+alltables[element][key]);
            
            let tabledescription=await phpcon(`DESCRIBE ${alltables[element][key]}`);
            let temptable=alltables[element][key];
            let temp={};
            for(element1 in tabledescription){
               let temp2={};
               if(tabledescription[element1].Key=="PRI"){
                  primaryKey=tabledescription[element1].Field;  
                  if(idfield=="true"){
                  
                  temp2["type"]=String;
                  temp2["required"]=false;
                  temp["temp"]=temp2;
                  }
                  else{
                  // primaryKey=tabledescription[element1].Field;  
                  temp2["type"]=String;
                  temp2["required"]=true;
                  temp["_id"]=temp2;
                  }
                 
                  
               }
               else{
                  let type="";
               if(tabledescription[element1].Type.includes("(")){ type=tabledescription[element1].Type.substr(0,tabledescription[element1].Type.indexOf("(")).trim(); }
               else{ type=tabledescription[element1].Type.trim();             }
            //   if(tabledescription[element1].Null.trim()=="NO"){ temp2["required"]=true;}
               if(tabledescription[element1].Default!=null){temp2["default"]=tabledescription[element1].Default;}

               //=============================checking types stat ==================================
               if((["tinyint","tinyint"]).includes(type)){
                  temp2["type"]=Boolean;
               }
               else if(["varchar","char","tinytext","text","mediumtext","longtext"].includes(type)){
                  temp2["type"]=String;
                  
                  }
               else if(["float","int"].includes(type)){
                     temp2["type"]=Number;
                    
                     }
                     temp[tabledescription[element1].Field]=temp2;
               //=================================check type ends=======================================
         }
         
         if(tabledescription[element1].Field!=primaryKey)tableFieldsForQuery+=", "+temptable+"."+tabledescription[element1].Field+" AS "+tabledescription[element1].Field+" ";
         
      }
           // console.log("lrngth of schema=="+JSON.stringify(temp));
            alltablesschema[temptable]={tableschema:temp,primaryKey,tableFieldsForQuery};
      
         j++;

           
         }
         
        
         // console.log("akll tables=="+alltablesschema.vegetables._id+"j=="+j);
        return alltablesschema;
        
}
const inserttomongod=async (phpcon,mongocon,mongoschema,idfield,tables=null)=>{
      result={};
      if(!phpcon || !mongocon){ throw new Error("not conected to "+(phpcon?"mongo database ":"php database"));}
      let alltables=await phpcon("show tables");
     //console.log("scheama ===="+JSON.stringify(mongoschema));

      for(element in alltables){
         let key=Object.keys(alltables[element]);
         if(Array.isArray(tables) && !tables.includes(alltables[element][key]))
         { continue;}
        
        let tableSchema=new mongoose.Schema(mongoschema[alltables[element][key]]["tableschema"]);
        let mongomodel=mongoose.model(alltables[element][key],tableSchema);
        console.log(`SELECT ${alltables[element][key]}.${mongoschema[alltables[element][key]]["primaryKey"]} AS _id ${mongoschema[alltables[element][key]]["tableFieldsForQuery"]} FROM ${alltables[element][key]} ;`);

        let tabledata=await phpcon(`SELECT ${alltables[element][key]}.${mongoschema[alltables[element][key]]["primaryKey"]} AS ${(idfield=='true')?'temp':'_id'} ${mongoschema[alltables[element][key]]["tableFieldsForQuery"]} FROM ${alltables[element][key]} ;`);
      //  =================== get all collection name =============================
      let docs = await mongoose.connection.db.listCollections().toArray();
      let checkCollectionAlreadyPresent=false;
      for(index in docs){
         if(docs[index]["name"].trim()==alltables[element][key].trim())
         {  checkCollectionAlreadyPresent=true;
            console.log(docs[index]["name"])
         }
      }
      if(checkCollectionAlreadyPresent==true) continue;
      //============================get all collection ends========================
        

        console.log("length=="+tabledata.length+" "+await mongomodel.countDocuments());
        if(tabledata.length==await mongomodel.countDocuments()){ continue;}
        // console.log("table data"+JSON.stringify(tabledata));
        let res=await mongomodel.insertMany(tabledata);
         console.log("res=="+res);

         result[alltables[element][key]]=res;

      }
      console.log(result);
      return result;
}
module.exports={createMongoSchema,inserttomongod};
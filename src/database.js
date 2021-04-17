const mongoose=require("mongoose");
async function a(){
    try{
const con=await mongoose.connect("mongodb://localhost:27017/olymics",{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true
})
    
    console.log("successfully connected"+(con));
    let arr=await mongoose.connection.db.listCollections().toArray()
   // console.log("asdasd"+JSON.stringify(arr));
    
    let schema=new mongoose.Schema({
        name:{type:String,
            driver:mongoose.ObjectId,
            unique:true}
    });

    let model=mongoose.model("maaono",schema);

    let inone=new model({name:"rahul"});

    let incount=await inone.save();
    console.log(incount);

    }

catch(e){
    throw new Error(e);
}


}



a();
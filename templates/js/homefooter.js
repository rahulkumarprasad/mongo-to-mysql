function onch(e){
    console.log(e.target.value);
    if(e.target.value=="mongotophp"){
        document.getElementById("phpTableSection").style.display="none";
        document.getElementById("mongoTableSection").style.display="block";
        document.getElementById("phpPrimaryKeyOptionDiv").style.display="none";
        document.getElementById("mongoPrimaryKeyOptionDiv").style.display="block";

    }else{
        document.getElementById("phpTableSection").style.display="block";
        document.getElementById("mongoTableSection").style.display="none";
        document.getElementById("phpPrimaryKeyOptionDiv").style.display="block";
        document.getElementById("mongoPrimaryKeyOptionDiv").style.display="none";

    }

}
function tableonchange(e){
    if(e.target.value.toLowerCase()==("phpConvertAllTable").toLowerCase()){
       document.getElementById("textFieldPhp").style.display="none";
    }else if(e.target.value.toLowerCase()==("phpConvertOnly").toLowerCase()){
        document.getElementById("textFieldPhp").style.display="block";
    }
    else if(e.target.value.toLowerCase()==("mongoConvertAllTable").toLowerCase()){
        document.getElementById("textFieldMongo").style.display="none";
    }else if(e.target.value.toLowerCase()==("mongoConvertOnly").toLowerCase()){
        document.getElementById("textFieldMongo").style.display="block";
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    ;
    if(document.getElementsByName("conversionmethod")[0].checked==true){
        console.log(document.getElementsByName("conversionmethod")[0].value)
        document.getElementById("phpTableSection").style.display="block";
        document.getElementById("mongoTableSection").style.display="none";
        document.getElementById("phpPrimaryKeyOptionDiv").style.display="block";
        document.getElementById("mongoPrimaryKeyOptionDiv").style.display="none";

    }else{
        console.log(document.getElementsByName("conversionmethod")[1].value)
        
        document.getElementById("phpTableSection").style.display="none";
        document.getElementById("mongoTableSection").style.display="block";
        document.getElementById("phpPrimaryKeyOptionDiv").style.display="none";
        document.getElementById("mongoPrimaryKeyOptionDiv").style.display="block";

    }

})
document.addEventListener("DOMContentLoaded",() =>{
    let allimg=document.getElementsByTagName("img");
    for(let img in allimg){
        allimg[img].addEventListener("mouseover",(e) =>{
            overeventhandler(e);
        });
        allimg[img].addEventListener("mouseout",(e) =>{
            overeventhandler(e);
        });
    }
    function overeventhandler(e){
        console.log(e);
            if(e.target.style.transform == null || e.target.style.transform==""){
            console.log(e.target.getAttribute("src"));
            e.target.style.transform = "scale(1.5)";
            e.target.style.transition = "transform 0.25s ease";
            }
            else{
                e.target.style.transform = "";
            e.target.style.transition = "";
            }
    }
})
document.getEle
var file=require('fs').promises;
var path=require('path');
const fileOps=async(data)=>{
    try{
       await file.appendFile(path.join(__dirname,"text1.txt"),JSON.stringify(data)+"\n");
    }
    catch(err){
       console.log(err);
    }
}
//console.log(fileOps("We are here"))
module.exports=fileOps;
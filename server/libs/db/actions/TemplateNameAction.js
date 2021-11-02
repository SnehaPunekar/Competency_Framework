const db = require('../../../config/config');

class TemplateName{

    constructor(){

    }

    //hello
 GetTemplateName = async function(){
    let output = [];
    return new Promise(function (resolve, reject){
        db.query('SELECT Temp_id,TempName FROM template;',(err,result)=>{
            if(err){
                console.log(err);
                return reject(err);
            }
            else{
                if(result.length > 0 ){
                    //res.json({data:result});
                    output = result;
                }
                else{
                    console.log('No data found!');
                }
                return resolve(result);
            }
        });
    })
}


AddTemplateName = async function(tempName){
    // const AreaName = request.body.AreaName;
     console.log(tempName);
    return new Promise(function (resolve, reject){
        db.query('INSERT INTO template(TempName) VALUES (?)',[tempName],(error,result)=>{
        if(error){
            console.log(error);
            return reject(error);
        }
        else{
            if(result.length > 0){
                console.log(result);
            }
            else{
                console.log('No data found');
            }
        }
    });
})
}

AddTemplate = async function(tid,s){
    //  console.log(tempName);
    return new Promise(function (resolve, reject){
        s.forEach(key => {
            db.query('INSERT INTO comp_temp(Temp_id, Desc_id) VALUES (?,?)',[tid,key],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    //console.log(res)
                    if(result.length > 0){
                        console.log({data:result, success: true});
                    }
                    else{
                        console.log('No data found');
                    }
                }
            })
        })
        //response.json({success:true})
    });
}
}

module.exports = TemplateName;
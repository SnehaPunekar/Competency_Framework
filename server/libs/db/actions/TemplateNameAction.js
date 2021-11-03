const db = require('../../../config/config');

class TemplateName{

    constructor(){

    }

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
        });
    }

    AddTemplate = async function(tid,s){
        return new Promise(function (resolve, reject){
            s.forEach(key => {
                db.query('INSERT INTO comp_temp(Temp_id, Desc_id) VALUES (?,?)',[tid,key],(err,result)=>{
                    if(err){
                        console.log(err);
                        return reject(err);
                    }else{
                        if(result.length > 0){
                            output = result;
                        }else{
                            console.log('No data found');
                        }
                        return resolve({data:result, success: true});
                    }
                });
            });
        });
    }

    GetTemplateDescriptor = async function(temp_id){
        let output = [];
        return new Promise(function (resolve, reject){
            db.query('Select AreaName,Description, ct.Desc_id from comp_temp ct, competency_descriptor cd, competency_area ca where ct.Desc_id = cd.Desc_id AND cd.Area_id = ca.Area_id AND Temp_id= ? ',[parseInt(temp_id)],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(result.length > 0 ){
                        output = result;
                    }else{
                        console.log('No data found!');
                    }
                    return resolve(result);
                }
            });
        });
    }

    GetDescriptorByRole = async function(roleId){
        let output = [];
        return new Promise(function (resolve, reject){
            db.query('SELECT Desc_id,Description, Area_id, Role_id, Track, Status FROM competency_descriptor where role_id=?;',[parseInt(roleId)],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(result.length > 0 ){   
                        output = result;                   
                    }
                    else{
                        console.log('No data found!');
                    }
                    return resolve(result);
                }
            });
        });
    }
}

module.exports = TemplateName;
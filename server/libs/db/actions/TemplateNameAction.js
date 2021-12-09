const db = require('../../../config/config');

class TemplateName{

    GetTemplateName = async function(){
        let output = [];
        return new Promise(function (resolve, reject){
            db.query('SELECT Temp_id,TempName FROM template;',(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
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
                    return resolve(result);
                }
            });
        });
    }

    GetRoleName = async function(temp_id){
        return new Promise(function (resolve, reject){
            db.query('SELECT role_name FROM role r, comp_temp c WHERE r.role_id = c.role_id AND c.temp_id = ?',[temp_id],  // IN (SELECT DISTINCT role_id FROM comp_temp WHERE temp_id = ?);',
             (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }
                else{
                    if(result.length > 0){
                        return resolve({success : true, data : result[0].role_name});
                    }else{
                        return resolve({success : false});
                    }                        
                }
            });
        });
    }

    AddTemplate = async function(tid, roleid, s){
        return new Promise(function (resolve, reject){
            s.forEach(key => {
                db.query('INSERT INTO comp_temp(Temp_id, role_id, Desc_id) VALUES (?,?,?)',
                [tid, roleid, key],(err,result)=>{
                    if(err){
                        console.log(err);
                        return reject(err);
                    }else{
                        if(result.length > 0){
                            output = result;
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
            db.query('Select AreaName, Description, ct.Desc_id from comp_temp ct, competency_descriptor cd, competency_area ca where ct.Desc_id = cd.Desc_id AND cd.Area_id = ca.Area_id AND Temp_id= ? ',
            [parseInt(temp_id)],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(result.length > 0){  
                        return resolve({data : result, success : true});                      
                    }else{                        
                        return resolve({success : false});
                    }
                }
            });
        });
    }

    GetDescriptorByRole = async function(roleId){
        let output = [];
        return new Promise(function (resolve, reject){
            db.query('SELECT Desc_id, Description, Area_id, Role_id, Track, Status FROM competency_descriptor where role_id=?;',[parseInt(roleId)],(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(result.length > 0 ){   
                        output = result;                   
                    }
                    return resolve(result);
                }
            });
        });
    }
}

module.exports = TemplateName;
const db = require('../../../config/config');

class CompetencyDescriptor{

    constructor(){

    }

    GetCompetencyDescriptor = async function(){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('SELECT Desc_id,Description, Area_id, Role_id, Track, Status FROM competency_descriptor;',(err,result)=>{
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

    AddCompetencyDescriptor = async function(areaName, desc, role, track, status){
        return new Promise(function (resolve, reject){
            let st = 0;
            if(status == "Active"){
                st = 1;
            }
            else{
                st = 0;
            }
            db.query('INSERT INTO competency_descriptor(Description, Area_id, role_id, Track, Status) VALUES (?,?,?,?,?)',
            [desc, areaName, role, track, st], (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }
                else{
                    if(result.length > 0){
                        output = result;
                    }
                    return resolve({data:result, success: true});
                }
            });
        });
    }

    ChangeStatusById = async function(descriptorId, descriptorStatus){
        return new Promise(function (resolve, reject){
            //console.log(descriptorId, descriptorStatus);
            db.query('UPDATE competency_descriptor SET Status = ? WHERE Desc_id = ?',
            [descriptorStatus, descriptorId], (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }
                else{
                    // console.log(result);
                    if(result.length > 0){
                        //console.log('Done');
                        output = result;
                    }
                    return resolve({data:result, success: true});
                }
            });
        });
    }
}

module.exports = CompetencyDescriptor;

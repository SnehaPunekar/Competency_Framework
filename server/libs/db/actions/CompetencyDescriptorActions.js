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
            db.query('INSERT INTO competency_descriptor(Description, Area_id, role_id, Track, Status) VALUES (?,?,?,?,?)',
            [desc, areaName, role, track, status], (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }
                else{
                    if(result.length > 0){
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

module.exports = CompetencyDescriptor;

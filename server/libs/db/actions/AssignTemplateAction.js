const mysql = require('mysql');
const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'competency_framework',
    dateStrings: 'date',
});

class AssignTemplate{

    constructor(){

    }

AddAssignTemp = async function(AreaNamtempId,reviewCId,key){
       return new Promise(function (resolve, reject){
        db.query('INSERT INTO assign_template(Temp_id,review_cycle_id,emp_id) VALUES (?,?,?)',
        [tempId,reviewCId,key],
        (error,result)=>{
            if(error){
                console.log(error);
                return reject(err);
            }
            else{
                if(result.length > 0){
                    console.log(result);
                }
                else{
                    console.log('No data');
                }
                return resolve(result);
            }
        });
        })
     }  
}
    
    module.exports = AssignTemplate;
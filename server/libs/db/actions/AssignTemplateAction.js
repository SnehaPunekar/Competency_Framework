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

    AddAssignTemp = async function(tempId,reviewCId,empId){
        console.log(tempId,reviewCId,empId);
        return new Promise(function (resolve, reject){
            empId.map((key) => {
                db.query('INSERT INTO assign_template(review_cycle_id, Temp_id, emp_id) VALUES (?,?,?)',
                [tempId,reviewCId,key], (error,result)=>{
                    if(error){
                        console.log(error);
                        return reject(error);
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
            });
        });        
    }  
}
    
module.exports = AssignTemplate;
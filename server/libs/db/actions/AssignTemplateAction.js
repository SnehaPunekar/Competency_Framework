const db = require('../../../config/config');

class AssignTemplate{

    constructor(){

    }

    GetEmpNames = async function (reviewCId, tempId) {
        let output = [];
        return new Promise(function (resolve, reject) {
            /*
            'SELECT DISTINCT at.emp_id, first_name, last_name FROM assign_template at, employee e WHERE e.emp_id != at.emp_id AND review_cycle_id = ? AND Temp_id = ?;', 
            [parseInt(reviewCId), parseInt(tempId)], 
            */
            db.query('SELECT Emp_id,first_name,last_name FROM Employee;', (err,empId)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(empId.length > 0 ){
                        for(let i = 0; i < empId.length; i++) {
                            db.query('SELECT * FROM assign_template WHERE review_cycle_id = ? AND (Temp_id = ? AND emp_id = ?);',
                            [reviewCId, tempId, empId[i].Emp_id], (error,result)=>{
                                if(error){
                                    console.log(error);
                                    return reject(error);
                                }
                                else{
                                    if(result.length == 0){
                                        let element = {};
                                        element.Emp_id = empId[i].Emp_id;
                                        element.first_name = empId[i].first_name;
                                        element.last_name = empId[i].last_name;
                                        output.push(element);
                                    }
                                    if( i == empId.length - 1){
                                        return resolve(output);
                                    }
                                }
                            });
                        }
                    }
                    else{
                        console.log('No data found!');
                    }
                }
            });  
        });
    }   
    
    AddAssignTemp = async function(tempId,reviewCId,empId){
        console.log(tempId,reviewCId,empId);
        return new Promise(function (resolve, reject){
            empId.map((key) => {
                db.query('SELECT * FROM assign_template WHERE review_cycle_id = ? AND (Temp_id = ? AND emp_id = ?);',
                [reviewCId,tempId,key], (error,result)=>{
                    if(error){
                        console.log(error);
                        return reject(error);
                    }
                    else{
                        if(result.length == 0){
                            db.query('INSERT INTO assign_template(review_cycle_id, Temp_id, emp_id) VALUES (?,?,?)',
                            [reviewCId,tempId,key], (error1,result1)=>{
                                if(error1){
                                    console.log(error1);
                                    return reject(error1);
                                }
                                else{
                                    if(result1.length > 0){
                                        console.log(result1);
                                    }
                                    else{
                                        console.log('No data');
                                    }
                                    return resolve({data:result1, success: true});
                                }
                            });
                        }
                        else{
                            console.log('No data');
                        }
                        return resolve({data:result, success: true});
                    }
                });
            });
        });        
    }
    
    ViewAssignedTemplate = async function (reviewCId) {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('SELECT at.emp_id, first_name, last_name, TempName FROM assign_template at, employee e, template t where at.emp_id = e.emp_id AND at.Temp_id = t.Temp_id AND review_cycle_id= ? '
            ,[parseInt(reviewCId)], (error,result)=>{                
                if(error){
                    console.log(error);
                    return reject(error);
                }
                else{
                    if(result.length > 0){
                        console.log(result);  
                        return resolve(result);                      
                    }                    
                }            
            });
        });
    }  
}
    
module.exports = AssignTemplate;
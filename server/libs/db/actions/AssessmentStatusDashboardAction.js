const { query } = require('express');
const db = require('../../../config/config');

class AssessmentStatusDashboardAction{
    EmpCount = 0;

    constructor(){

    }

    GetSelfAssessmentByRole = async function (roleId, reviewId) {
        let output = [{ name: 'Completed', value: 0},
                      { name: 'Saved as draft', value: 0},
                      { name: 'Not yet Performed', value: 0}];
        let count = 0;
        let query1 = "", query2 = "", query3 = "";
        query1 = "SELECT DISTINCT emp_id FROM assessment WHERE draft = 1 AND review_cycle_id = ? AND role_id = ?;";
        query2 = "SELECT DISTINCT emp_id FROM assessment WHERE draft = 0 AND review_cycle_id = ? AND role_id = ?;";
        query3 = "SELECT assign.emp_id FROM assign_template assign, employee emp WHERE assign.emp_id = emp.emp_id AND assign.review_cycle_id = ? AND emp.role_id = ?;";
        
        return new Promise(function (resolve, reject) {
            db.query(query1, [reviewId, roleId], (err1, res1) => {
                            if(err1){
                                return reject(err1);
                            }else{
                                if(res1.length > 0 ){
                                    count += res1.length;
                                    output.map((val) => {
                                        if(val.name == 'Completed'){                           
                                            val.value += res1.length;
                                        }                                        
                                    })            
                                }
                            }
                        });
                        db.query(query2, [reviewId, roleId], (err2, res2) => {
                            if(err2){
                                return reject(err2);
                            }else{
                                if(res2.length > 0 ){
                                    count += res2.length;
                                    output.map((val) => {
                                        if(val.name == 'Saved as draft'){                           
                                            val.value += res2.length;
                                        }                                        
                                    })             
                                }
                            }
                        });
                        db.query(query3, [reviewId, roleId], (err3, res3) => {
                            if(err3){
                                return reject(err3);
                            }else{
                                if(res3.length > 0 ){
                                    output.map((val) => {
                                        if(val.name == 'Not yet Performed'){
                                            val.value += (res3.length - count);
                                            count = 0; 
                                        }                                        
                                    })           
                                }           
                        console.log("Self assessmentc response");                    
                        console.log(output);
                        return resolve(output);
                    }
                });
            });
        }


    GetLeadAssessmentByRole = async function (roleId, reviewId) {
        let output = [{ name: 'Completed', value: 0},
                      { name: 'Saved as draft', value: 0},
                      { name: 'Not yet Performed', value: 0}];
        let count = 0;
        let query1 = "", query2 = "", query3 = "";
        query1 = "SELECT DISTINCT emp_id FROM assessment WHERE lead_draft = 1 AND review_cycle_id = ? AND role_id = ?;";
        query2 = "SELECT DISTINCT emp_id FROM assessment WHERE lead_draft = 0 AND review_cycle_id = ? AND role_id = ?;";
        query3 = "SELECT assign.emp_id FROM assign_template assign, employee emp WHERE assign.emp_id = emp.emp_id AND assign.review_cycle_id = ? AND emp.role_id = ?;";
        
        return new Promise(function (resolve, reject) { 
            db.query(query1, [reviewId, roleId], (err1, res1) => {
                if(err1){
                    return reject(err1);
                }else{
                    if(res1.length > 0 ){
                        count += res1.length;
                        output.map((val) => {
                        if(val.name == 'Completed'){                           
                            val.value += res1.length;
                        }                                        
                    })           
                }
            }
        });
        db.query(query2, [reviewId, roleId], (err2, res2) => {
            if(err2){
                return reject(err2);
            }else{
                if(res2.length > 0 ){
                    count += res2.length;
                    output.map((val) => {
                        if(val.name == 'Saved as draft'){                           
                            val.value += res2.length;
                        }                                        
                    })             
                }
            }
        });
        db.query(query3, [reviewId, roleId], (err3, res3) => {
            if(err3){
                return reject(err3);
            }else{
                if(res3.length > 0 ){
                output.map((val) => {
                if(val.name == 'Not yet Performed'){
                    val.value += (res3.length - count);
                    count = 0; 
                    }                                        
                })           
            }   
            console.log("Lead assessment response");                                
            console.log(output)
            return resolve(output);
                }
            });
        });
    }

}

module.exports = AssessmentStatusDashboardAction;
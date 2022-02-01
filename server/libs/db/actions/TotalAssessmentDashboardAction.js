const db = require('../../../config/config');

class TotalAssessmentDashboard{

    constructor(){

}

GetTotalEmp = async function () {
    let output = 0;
    return new Promise(function (resolve, reject) {
        db.query("SELECT emp_id, first_name, last_name FROM employee;", (err, result) => {
            if(err){
                console.log(err);
                return reject(err);
            }else{
                if(result.length > 0 ){
                    output = result.length;              
                }
                return resolve(output);
            }
        });
    });
}

GetSelfAssessmentCount = async function (reviewId) {
    console.log(reviewId);
    let output = 0;
    return new Promise(function (resolve, reject) {
        db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND draft = 1;", 
        [reviewId], (err2, res2) => {
        if(err2){
            console.log(err2);
            return reject(err2);
            }else{
                console.log(res2);
                if(res2.length > 0 ){
                    output += res2.length;                                                                                   
                }
                return resolve(output);
            }
        });
    });
}
    

GetTotalLead = async function () {
    let output = 0;
    return new Promise(function (resolve, reject) {
        db.query("SELECT emp_id, first_name FROM employee WHERE role = 'Lead';", (err, result) => {
            if(err){
                console.log(err);
                return reject(err);
            }else{
                if(result.length > 0 ){
                    output = result.length;                    
                }
                return resolve(output);
            }
        });
    });
}

GetLeadAssessmentCount = async function (reviewId) {
    let output = 0;
    return new Promise(function (resolve, reject) {
        db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND lead_rating != '' AND draft = 1 AND lead_draft = 1;",
                        [reviewId], (err1, res1) => {
                            if(err1){
                                return reject(err1);
                            }else{
                                if(res1.length > 0 ){
                                    output += res1.length;                                                                                   
                                }
                                return resolve(output);
                            }                     
                        }); 
                    });    
            }
}

module.exports = TotalAssessmentDashboard ;
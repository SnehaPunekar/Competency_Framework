const db = require('../../../config/config');

class DashboardAction{
    EmpCount = 0;

    constructor(){

    }

    GetRatingValue = async function(){
        let output = [];
        const query = "SELECT Desc_id, self_rating, lead_rating FROM assessment;"
        const ratingValue = [{name : 'A', value : 20}, 
                            {name : 'B', value : 15}, 
                            {name : 'C', value : 10}, 
                            {name : 'I', value : 5}];
        let final = [];     
        let finalOutput = [];  
        return new Promise(function (resolve, reject) {
            db.query(query,(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(result.length > 0 ){
                        const descSelect = "SELECT Area_id FROM competency_descriptor WHERE Desc_id = ?";
                        for(let i = 0; i < result.length; i++){ 
                            let avgEmp = 0, countEmp = 0;    
                            let avgLead = 0, countLead = 0;                   
                            db.query(descSelect, [result[i].Desc_id], (err1, res1) => {  
                                if(err1){
                                    console.log(err1);
                                    return reject(err1);
                                }else{
                                    if(res1.length > 0) {
                                        let elements = {};
                                        let flag = 0;
                                        final.forEach(val => {
                                            if(val.cid === res1[0].Area_id){
                                                flag = 1;
                                                ratingValue.forEach(item => {
                                                    if(result[i].self_rating === item.name){
                                                        val.avgEmp = ((val.avgEmp * val.countEmp) + item.value)/ ++val.countEmp;
                                                    }
                                                    if(result[i].lead_rating === item.name){
                                                        val.avgLead = ((val.avgLead * val.countLead) + item.value)/ ++val.countLead;
                                                    }
                                                });        
                                            }
                                        });
                                        if(flag == 0){
                                            elements.cid = res1[0].Area_id;
                                            ratingValue.forEach(item => {
                                                if(result[i].self_rating === item.name){
                                                    avgEmp = ((avgEmp * countEmp) + item.value)/ ++countEmp;
                                                    elements.avgEmp = avgEmp;  
                                                    elements.countEmp = countEmp;
                                                }
                                                if(result[i].lead_rating === item.name){
                                                    avgLead = ((avgLead * countLead) + item.value)/ ++countLead;
                                                    elements.avgLead = avgLead;  
                                                    elements.countLead = countLead;
                                                }
                                            });
                                            final.push(elements);
                                        }  
                                        if(i == result.length-1){
                                            //console.log('final:',final);
                                            for(let j = 0; j < final.length; j++)
                                            {
                                                let element = {};
                                                db.query("SELECT AreaName FROM Competency_Area WHERE Area_id = ?;", [final[j].cid], (err2, res2) => {  
                                                    if(err2){
                                                        console.log(err2);
                                                        return reject(err2);
                                                    }else{
                                                        if(res2.length > 0) {
                                                            element.name = res2[0].AreaName;
                                                            element.Emp = final[j].avgEmp;
                                                            element.Lead = final[j].avgLead;
                                                            finalOutput.push(element);
                                                            if(j == final.length-1){                                                        
                                                              //  console.log("finalOutput:",finalOutput);                                                                
                                                                return resolve(finalOutput);
                                                               // response.json({data : finalOutput});
                                                            }
                                                        }
                                                    }
                                                });
                                            }                                    
                                        }
                                    }else{
                                        console.log('no data');
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
        })
    }

    GetTotalEmp = async function () {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT emp_id, first_name FROM employee;", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        output = result.length;              
                    }
                    else{
                        console.log('No data found!');
                    }
                    return resolve(result.length);
                }
            });
        });
    }

    GetSelfAssessmentCount = async function () {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT review_cycle_id FROM review_cycle WHERE active = 1;", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ?;", [result[0].review_cycle_id], (err1, res1) => {
                            if(err1){
                                console.log(err1);
                                return reject(err1);
                            }else{
                                if(res1.length > 0 ){
                                    output = res1.length;
                                }
                                else{
                                    console.log('No data found!');
                                }
                                return resolve(res1.length);
                            }
                        });                        
                    }
                    else{
                        console.log('No data found!');
                    }
                }
            });
        });
    }

    GetTotalLead = async function () {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT emp_id, first_name FROM employee WHERE role = 'Lead';", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        output = result.length;                    
                    }
                    else{
                        console.log('No data found!');
                    }
                    return resolve(result.length);
                }
            });
        });
    }

    GetLeadAssessmentCount = async function () {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT review_cycle_id FROM review_cycle WHERE active = 1;", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND lead_rating != '';", [result[0].review_cycle_id], (err1, res1) => {
                            if(err1){
                                console.log(err1);
                                return reject(err1);
                            }else{
                                if(res1.length > 0 ){                                 
                                    output = res1.length;
                                }
                                else{
                                    console.log('No data found!');
                                }
                                return resolve(res1.length);
                            }
                        });                        
                    }
                    else{
                        console.log('No data found!');
                    }
                }
            });
        });
    }

}

module.exports = DashboardAction;
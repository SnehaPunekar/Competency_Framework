const db = require('../../../config/config');

class DashboardAction{
    EmpCount = 0;

    constructor(){

    }

    GetRatingValue = async function(roleId, reviewId){
        let output = [];
        const query1 = "SELECT Desc_id, self_rating, lead_rating FROM assessment WHERE draft = 1;";
        const query2 = "SELECT Desc_id, self_rating, lead_rating FROM assessment WHERE draft = 1 AND role_id = ?;";
        const query3 = "SELECT Desc_id, self_rating, lead_rating FROM assessment WHERE draft = 1 AND review_cycle_id = ?;";
        const query4 = "SELECT Desc_id, self_rating, lead_rating FROM assessment WHERE draft = 1 AND role_id = ? AND review_cycle_id = ?;";
        
        const ratingValue = [{name : 'A', value : 20}, 
                            {name : 'B', value : 15}, 
                            {name : 'C', value : 10}, 
                            {name : 'I', value : 5}];
        let final = [];     
        let finalOutput = []; 
        let query = ''; 
        let parameter = [];
        return new Promise(function (resolve, reject) {
            
            if(roleId == 0 && reviewId == 0){
                query = query1; 
                parameter = [0];
            }else if(roleId != 0 && reviewId == 0){
                query = query2; 
                parameter = [roleId];
            }else if(roleId == 0 && reviewId != 0){
                query = query3; 
                parameter = [reviewId];
            }else if(roleId != 0 && reviewId != 0){
                query = query4; 
                parameter = [roleId, reviewId];
            }

            db.query(query, parameter, (err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                   // console.log('R ',result);
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
                                                        avgEmp = ((val.avgEmp * val.countEmp) + item.value);
                                                        val.countEmp += 1;
                                                        val.avgEmp = avgEmp / val.countEmp;
                                                    }
                                                    if(result[i].lead_rating === item.name){
                                                        avgLead = ((val.avgLead * val.countLead) + item.value);
                                                        val.countLead += 1;
                                                        val.avgLead = avgLead / val.countLead;
                                                    }
                                                });        
                                            }
                                        });
                                        if(flag == 0){
                                            elements.cid = res1[0].Area_id;
                                            elements.avgEmp = 0;
                                            elements.countEmp = 0;
                                            elements.avgLead = 0;
                                            elements.countLead = 0;

                                            ratingValue.forEach(item => {
                                                if(result[i].self_rating === item.name){
                                                    elements.avgEmp = item.value;  
                                                    elements.countEmp = countEmp + 1;
                                                }
                                                if(result[i].lead_rating === item.name){
                                                    elements.avgLead = item.value;  
                                                    elements.countLead = countLead + 1;
                                                }
                                            });
                                            final.push(elements);
                                        }  
                                        if(i == result.length-1){
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
                                                            element.Emp =  Math.round(final[j].avgEmp);
                                                            element.Lead = Math.round(final[j].avgLead);
                                                            finalOutput.push(element);
                                                            if(j == final.length-1){                                                                                      
                                                                return resolve(finalOutput);
                                                            }
                                                        }
                                                    }
                                                });
                                            }                                    
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        })
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

    GetSelfAssessmentCount = async function () {
        let output = 0, output1 = 0, output2 = 0;
        return new Promise(function (resolve, reject) {
            db.query("SELECT review_cycle_id FROM review_cycle WHERE active = 1;", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        for(let i = 0; i < result.length; i++){
                            db.query("SELECT DISTINCT emp_id FROM assign_template WHERE review_cycle_id = ?;", 
                            [result[i].review_cycle_id], (err1, res1) => {
                                if(err1){
                                    console.log(err1);
                                    return reject(err1);
                                }else{
                                    if(res1.length > 0 ){
                                        output1 += res1.length;
                                    }
                                }
                            });
                            db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND draft = 1;", 
                            [result[i].review_cycle_id], (err2, res2) => {
                                if(err2){
                                    console.log(err2);
                                    return reject(err2);
                                }else{
                                    if(res2.length > 0 ){
                                        output2 += res2.length;
                                    }
                                    if(i == result.length - 1){  
                                        output = (output2 / output1) * 100;                                                                                
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

    GetLeadAssessmentCount = async function () {
        let output1 = 0, output2 = 0, output = 0;
        return new Promise(function (resolve, reject) {
            db.query("SELECT review_cycle_id FROM review_cycle WHERE active = 1;", (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        for(let i = 0; i < result.length; i++) {
                            db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND lead_rating != '' AND draft = 1 AND lead_draft = 1;",
                            [result[i].review_cycle_id], (err1, res1) => {
                                if(err1){
                                    console.log(err1);
                                    return reject(err1);
                                }else{
                                    if(res1.length > 0 ){                                 
                                        output1 += res1.length;
                                    }                                    
                                }
                            }); 
                            db.query("SELECT DISTINCT emp_id FROM assessment WHERE review_cycle_id = ? AND draft = 1;",
                            [result[i].review_cycle_id], (err2, res2) => {
                                if(err2){
                                    console.log(err2);
                                    return reject(err2);
                                }else{
                                    if(res2.length > 0 ){                                 
                                        output2 += res2.length;
                                    }
                                    if(i == result.length-1){       
                                        output = (output1 / output2) * 100;                            
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

}

module.exports = DashboardAction;
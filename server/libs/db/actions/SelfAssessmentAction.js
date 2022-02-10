const db = require('../../../config/config');

class SelfAssessment{

    GetActiveReviewCycle = async function(){
        let output = [];
        return await new Promise(async function (resolve, reject) {
         db.query("SELECT review_cycle_id, review_cycle_name FROM review_cycle Where active = 1;",
          (err,result)=>{
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
        })
    }

    GetSelfAssessment = async function(review_id, emp_id){
        let flag = 0;
        let output = [];
        return await new Promise(async function (resolve, reject) {
            db.query("SELECT Desc_id, self_rating, self_comment, draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ?",
                [review_id, emp_id],  (err2, res2) => {  
                if(err2){                
                    return reject(err2);
                }else{
                    if(res2.length > 0){
                        if(res2[0].draft == 1){
                            return resolve({update : true});
                        }
                    }
                }
                //console.log(output);
            });

            const sqlSelect = "SELECT Temp_id FROM assign_template WHERE review_cycle_id = ? AND emp_id = ?";
            const descIdSelect = "SELECT Desc_id FROM comp_temp WHERE Temp_id = ?";
            const descSelect = "SELECT Desc_id, Description, Area_id FROM competency_descriptor WHERE Desc_id = ?";
                
            let final = [];
             db.query(sqlSelect, [review_id, emp_id], (error, result) => {
                if(result.length > 0 && !error){                        
                 db.query(descIdSelect, [result[0].Temp_id], (err3, descArr) => {                            
                        if(descArr.length > 0 && !err3){                        
                            for(let i = 0; i < descArr.length; i++){  
                                db.query(descSelect, [descArr[i].Desc_id], (err1, res1) => {                                        
                                    if(res1.length > 0 && !err1){
                                        db.query("SELECT Desc_id, self_rating, self_comment, draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ? AND Desc_id = ?",
                                            [review_id, emp_id, descArr[i].Desc_id], (err2, res2) => {  
                                            if(err2){                
                                                return reject(err2);
                                            }else{
                                                if(res2.length > 0){
                                                    let element = {};
                                                    element.cid = res1[0].Area_id;
                                                    element.did = res1[0].Desc_id;
                                                    element.des = res1[0].Description;
                                                    element.selfRating = res2[0].self_rating;
                                                    element.selfComment = res2[0].self_comment;                              
                                                    final.push(element); 
                                                }else{
                                                    let element2 = {};
                                                    element2.cid = res1[0].Area_id;
                                                    element2.did = res1[0].Desc_id;
                                                    element2.des = res1[0].Description;  
                                                    final.push(element2);
                                                }                                                
                                                if(i == descArr.length-1){  
                                                     output = final.sort(function(a, b) { 
                                                        return (a["did"] > b["did"]) ? 1 : ((a["did"] < b["did"]) ? -1 : 0);
                                                     });
                                                    // console.log(output);
                                                    flag = 1;
                                                    return resolve({data:output, success: true});
                                                }
                                            }
                                        });
                                    }                           
                                })   
                            }      
                        } 
                    });
                }else{
                    if(flag != 1){
                        return resolve({success: false});
                    }
                }          
            });
        });
    }

    ViewSelfAssessment = async function(review_id, emp_id){
        let flag = 0;
        let output = [];
        return await new Promise(async function (resolve, reject) {
            db.query("SELECT Desc_id, self_rating, self_comment, draft, lead_rating, lead_comment, lead_draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ?",
            [review_id, emp_id], (err, results) => {                
                const descSelect = "SELECT Desc_id, Description, Area_id FROM competency_descriptor WHERE Desc_id = ?";
                if(err){
                    console.log(err);
                    return reject({error:err, success: false});
                }else{                    
                    if(results.length > 0){
                        if(results[0].draft == 0) {
                            return resolve({update : true});
                        }
                        let template = [];
                        for(let i = 0; i < results.length; i++){   
                            if(results[i].draft == 1) {
                                let elements = {};
                                db.query(descSelect, [results[i].Desc_id], (err2, res2) => {                    
                                    if(err2){
                                        console.log(err2);
                                    }else{
                                        if(res2.length > 0){
                                            elements.cid = res2[0].Area_id;
                                            elements.did = res2[0].Desc_id;
                                            elements.des = res2[0].Description;    
                                            elements.selfRating = results[i].self_rating;
                                            elements.selfComment = results[i].self_comment;
                                            if(results[i].lead_draft == 1){
                                                elements.leadRating = results[i].lead_rating;
                                                elements.leadComment = results[i].lead_comment;                                                    
                                            }
                                            template.push(elements); 
                                            if(i == results.length - 1){   
                                                output = template.sort(function(a, b) { 
                                                    return (a["did"] > b["did"]) ? 1 : ((a["did"] < b["did"]) ? -1 : 0);
                                                 });
                                                 console.log(output);
                                                return resolve({data:output, success: true});
                                            }
                                        }
                                    }                        
                                });
                            }                
                        }
                    }else{
                        return resolve({success: false});
                    }
                }
            });
        });
    }
  
    AddSelfAssessment = async function(review_id, emp_id, assessmentArr, draft){
        return await new Promise(async function (resolve, reject){ 
            let roleId = 0;
             db.query('SELECT role_id FROM employee WHERE emp_id = ?', [emp_id], 
             (err, roleID) => {  
                    if(err) {
                        return reject(err);
                    }else{
                        if(roleID.length > 0){
                            roleId = roleID[0].role_id;
                        }
                    }
                });
            
            for(let i = 0; i < assessmentArr.length; i++){
                db.query("SELECT Desc_id, draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ?", 
                [review_id, emp_id], (err, result) => {
                    if(err){
                        return reject({error:err, success: false});
                    }else{                 
                        if(result.length > 0){
                            if(result[i].draft === 1){
                                return resolve({success: false});  
                            }else{                    
                                const updateSql = "UPDATE assessment SET self_rating = ?, self_comment = ?, draft = ? WHERE Desc_id = ? AND (review_cycle_id = ? AND emp_id = ?)";
                                db.query(updateSql, [assessmentArr[i].rating, assessmentArr[i].comment, draft, assessmentArr[i].id, review_id, emp_id],
                                    (e, r) =>{ 
                                    if(e) {
                                        return reject(e);
                                    }
                                })
                            }
                        }else {
                            const sqlInsert = "INSERT INTO assessment(review_cycle_id, role_id, emp_id, Desc_id, self_rating, self_comment, draft) VALUES (?, ?, ?, ?, ?, ?, ?)"; 
                            db.query(sqlInsert, [review_id, roleId, emp_id, assessmentArr[i].id, assessmentArr[i].rating, assessmentArr[i].comment, draft], 
                                (error, result) => {  
                                if(error) {
                                    return reject(error);
                                }
                            });
                        }                         
                        
                        if(i == assessmentArr.length - 1){
                            return resolve({data:result, success: true});
                        }
                    }
                });
            }
        })
    }
}

module.exports = SelfAssessment;  

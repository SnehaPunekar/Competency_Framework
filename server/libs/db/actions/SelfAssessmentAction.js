const db = require('../../../config/config');

class SelfAssessment{

    constructor(){

    }

    GetActiveReviewCycle = async function(){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT review_cycle_id, review_cycle_name FROM review_cycle Where active = 1;",(err,result)=>{
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
        return new Promise(function (resolve, reject) {
            db.query("SELECT Desc_id, self_rating, self_comment, draft, lead_rating, lead_comment FROM assessment WHERE review_cycle_id = ? AND emp_id = ?",
            [review_id, emp_id], (err, results) => {
                
                const descSelect = "SELECT Desc_id, Description, Area_id FROM competency_descriptor WHERE Desc_id = ?";
                if(err){
                    console.log(err);
                    return reject({error:err, success: false});
                }else{
                    if(results[0].draft == 1){
                        return resolve({update : true});
                    }
                    if(results.length > 0){
                        let template = [];
                        for(let i = 0; i < results.length; i++){                
                            let elements = {};
                            db.query(descSelect, [results[i].Desc_id], (err2, res2) => {                    
                                if(err2){
                                    console.log(err2);
                                }else{
                                    if(res2.length > 0){
                                        res2.forEach(function(items) {
                                            elements.cid = items.Area_id;
                                            elements.did = items.Desc_id;
                                            elements.des = items.Description;    
                                            elements.selfRating = results[i].self_rating;
                                            elements.selfComment = results[i].self_comment;
                                            elements.leadRating = results[i].lead_rating;
                                            elements.leadComment = results[i].lead_comment;
                                            template.push(elements);                                               
                                        });
                                        if(i == results.length - 1){   
                                            output = template;
                                            flag = 1;
                                            return resolve({data:output, success: true});
                                        }
                                    }
                                }                        
                            });                
                        }
                    }else if(results.length == 0){
                        const sqlSelect = "SELECT Temp_id FROM assign_template WHERE review_cycle_id = ? AND emp_id = ?";
                        const descIdSelect = "SELECT Desc_id FROM comp_temp WHERE Temp_id = ?";
                        let final = [];
                        db.query(sqlSelect, [review_id, emp_id], (error, result) => {
                            if(result.length > 0 && !error){                        
                                db.query(descIdSelect, [result[0].Temp_id], (err3, descArr) => {                            
                                    if(descArr.length > 0 && !err3){                        
                                        for(let i = 0; i < descArr.length; i++){  
                                            db.query(descSelect, [descArr[i].Desc_id], (err1, res1) => {                                        
                                                if(res1.length > 0 && !err1){
                                                    var element = {};  
                                                    res1.forEach(function(items) {
                                                        element.cid = items.Area_id;
                                                        element.did = items.Desc_id;
                                                        element.des = items.Description;
                                                        final.push(element);                   
                                                    }); 
                                                    if(i == descArr.length-1){  
                                                        output = final;
                                                        flag = 1;
                                                        return resolve({data:output, success: true});
                                                    }
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
                    }
                }
            });
            
        });
    }
  
    AddSelfAssessment = async function(review_id, emp_id, assessmentArr, draft){
        return new Promise(function (resolve, reject){           
            db.query("SELECT Desc_id, draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ?", [review_id, emp_id], (err, result) => {
                if(result.length > 0 && !err){
                    if(result[0].draft === 1){
                        return resolve({success: false});  
                    }else{                    
                        const updateSql = "UPDATE assessment SET self_rating = ?, self_comment = ?, draft = ? WHERE Desc_id = ? AND (review_cycle_id = ? AND emp_id = ?)";
                        for(let i = 0; i < assessmentArr.length; i++)
                        {
                            if(typeof(assessmentArr[i].rating) != "undefined" && typeof(assessmentArr[i].comment) != "undefined"){                    
                                db.query(updateSql, [assessmentArr[i].rating, assessmentArr[i].comment, draft, assessmentArr[i].id, review_id, emp_id], (e, r) =>{ 
                                    if(e) {console.log(e);
                                        return reject(error);
                                    }else{
                                        if(r.length < 0){ 
                                            console.log('no data');
                                        }
                                    }
                                })
                            }
                            if(i == assessmentArr.length - 1){
                                return resolve({data:result, success: true});
                            }
                        }
                    }
                }else {
                    const sqlInsert = "INSERT INTO assessment(review_cycle_id, emp_id, Desc_id, self_rating, self_comment, draft) VALUES (?, ?, ?, ?, ?, ?)"; 
                    for(let i = 0; i < assessmentArr.length; i++)
                    {
                        db.query(sqlInsert, [review_id, emp_id, assessmentArr[i].id, assessmentArr[i].rating, assessmentArr[i].comment], 
                            (error, result) => {             
                                if(i == assessmentArr.length-1){                                     
                                    return resolve({data:result, success: true});
                            }      
                        });
                    }
                }
            });
        })
    }
}

module.exports = SelfAssessment;
const db = require('../../../config/config');

class SelfAssessment{

    constructor(){

    }

    GetEmployee = async function (leadName) {
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query("SELECT emp_id, first_name FROM employee WHERE lead_name = ?;",[leadName], (err, result) => {
                if(err){
                    console.log(err);
                    return reject(err);
                }else{
                    if(result.length > 0 ){
                        // res.json({data:result});
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

    GetLeadAssessment = async function(review_id, emp_id){
        let output = [];
        return new Promise(function (resolve, reject) {            
            db.query("SELECT Desc_id, self_rating, self_comment, lead_rating, lead_comment, lead_draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ? AND draft = 1;",
            [review_id, emp_id], (err, results) => {                
                if(err){                    
                    return reject(err);
                }else{
                    const descSelect = "SELECT Desc_id, Description, Area_id FROM competency_descriptor WHERE Desc_id = ?";
                    if(results.length > 0){   
                        if(results[0].lead_draft == 1){
                            return resolve({update : true});
                        }                 
                        let template = [];
                        for(let i = 0; i < results.length; i++){                
                            let elements = {};
                            db.query(descSelect, [results[i].Desc_id], (err2, res2) => {                    
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
                                        return resolve({data:output, success: true});
                                        //res.json({data:template, success:true}) 
                                    }
                                }                   
                            });                
                        }
                    }else{    
                        //console.log('error');   
                        return resolve({success: false});
                    }
                }                
            });
        });
    }

    ViewLeadAssessment = async function(review_id, emp_id){
        let output = [];
        return new Promise(function (resolve, reject) {            
            db.query("SELECT Desc_id, self_rating, self_comment, lead_rating, lead_comment, lead_draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ? AND draft = 1;",
            [review_id, emp_id], (err, results) => {                
                if(err){                    
                    return reject(err);
                }else{
                    const descSelect = "SELECT Desc_id, Description, Area_id FROM competency_descriptor WHERE Desc_id = ?";
                    if(results.length > 0){   
                        if(results[0].lead_draft == 0){
                            return resolve({update : true});
                        }                 
                        let template = [];
                        for(let i = 0; i < results.length; i++){                
                            let elements = {};
                            db.query(descSelect, [results[i].Desc_id], (err2, res2) => {                    
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
                                        return resolve({data:output, success: true});
                                        //res.json({data:template, success:true}) 
                                    }
                                }                   
                            });                
                        }
                    }else{    
                        //console.log('error');   
                        return resolve({success: false});
                    }
                }                
            });
        });
    }
 
    AddLeadAssessment = async function(review_id, emp_id, assessmentArr, lead_draft){
        return new Promise(function (resolve, reject){  
            db.query("SELECT Desc_id, lead_draft FROM assessment WHERE review_cycle_id = ? AND emp_id = ?", [review_id, emp_id], (err, result) => {
                if(result.length > 0){
                    if(result[0].draft === 1){
                        return resolve({success: false});  
                    }else{ 
                        const updateSql = "UPDATE assessment SET lead_rating = ?, lead_comment = ?, lead_draft = ? WHERE Desc_id = ? AND (review_cycle_id = ? AND emp_id = ?)";
                        for(let i = 0; i < assessmentArr.length; i++)
                        {
                            if(typeof(assessmentArr[i].rating) != "undefined" && typeof(assessmentArr[i].comment) != "undefined"){                    
                                db.query(updateSql, [assessmentArr[i].rating, assessmentArr[i].comment, lead_draft, assessmentArr[i].id, review_id, emp_id], (e, r) =>{ })
                            }
                            if(i == assessmentArr.length - 1){                            
                                return resolve({data:result, success: true});
                            }
                        }
                    }
                }else{  
                    console.log('error');  
                }   
            });
        });
    }
}

module.exports = SelfAssessment;
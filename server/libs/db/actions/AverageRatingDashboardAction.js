const { query } = require('express');
const db = require('../../../config/config');

class AverageRatingDashboardAction{
    EmpCount = 0;
    constructor(){
    }

    GetRatingValue =   function(roleId, reviewId){
      
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
        let finalOutput = [],data=[]; 
        let query = ''; 
        let parameter = [];
        return new Promise(async function (resolve, reject) {
            
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

            await db.query(query, parameter,  async (err,result)=>{
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
                            await db.query(descSelect, [result[i].Desc_id],  (err1, res1) => {  
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
                                            let count=0;
                                            final.forEach( (item,size)=>{
                                            
                                                let element = {};
                                               db.query("SELECT AreaName FROM Competency_Area WHERE Area_id = ? order by AreaName;", [item.cid],  (err2, res2) => {  
                                                    if(err2){
                                                        console.log(err2);
                                                        return reject(err2);
                                                    }else{
                                                        if(res2.length > 0) {
                                                            element.name = res2[0].AreaName;
                                                            element.Emp =  Math.round(item.avgEmp);
                                                            element.Lead = Math.round(item.avgLead);
                                                            finalOutput.push(element);
                                                            console.log("count",count);
                                                            console.log("size",size);
                                                            console.log("final.length-1",final.length-1);
                                                            if(count == final.length-1){                                                                                      
                                                                 data = finalOutput.sort(function(a, b) { 
                                                                        return (a["name"] > b["name"]) ? 1 : ((a["name"] < b["name"]) ? -1 : 0);
                                                                });
                                                                console.log({data});
                                                               return resolve(data);
                                                            }
                                                        }
                                                        count++;
                                                    }
                                                });
                                        });                            
                                        }
                                    }
                                }
                            });
                        }
                    }else{
                        let finalOutput1=[  { name: '', Emp: 0, Lead: 0 }
                    ];
                        return resolve(finalOutput1);
                    }
                }
              
            });
        })
    }

}
module.exports = AverageRatingDashboardAction;
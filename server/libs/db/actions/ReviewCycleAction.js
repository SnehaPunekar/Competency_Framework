const db = require('../../../config/config');

class ReviewCycles{

    constructor(){

    }

    GetReviewCycle = async function(){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('SELECT review_cycle_id, review_cycle_name, start_date, end_date, active FROM review_cycle;',(err,result)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
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
        })
    }
    
    AddReviewCycle = async function(reviewName, start, end, status){
        return new Promise(function (resolve, reject){
            db.query('INSERT INTO review_cycle(review_cycle_name, start_date, end_date, active) VALUES (?,?,?,?)',
            [reviewName,start,end], (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(err);
                }else{
                    if(result.length > 0){
                        console.log(result);
                        // response.json({data:result, success:true});
                    }else{
                        console.log('No data');
                    }
                    return resolve(result);
                }
            });
        });
    }
} 

    module.exports = ReviewCycles;
const db = require('../../../config/config');

class Rating{

    constructor(){

    }

    GetRating = async function(){
        let output = [];
        return new Promise(function (resolve, reject) {
            // console.log("inside Promise");
            db.query('SELECT rating_id, rating_name, description FROM rating;',(err, ratingResult)=>{
                if(err){
                    console.log(err);
                    return reject(err);
                }
                else{
                    if(ratingResult.length > 0 ){
                       output = ratingResult;
                    }
                    else{
                        console.log('No data found!');
                    }
                    return resolve(ratingResult);
                }
            });
        })
    }
  
    AddRating = async function(ratingName, ratingDesc){
        return new Promise(function (resolve, reject){
            db.query('INSERT INTO rating(rating_name, description) VALUES (?,?)',[ratingName, ratingDesc],
            (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }else{
                    if(result.length > 0){
                        console.log(result);
                    }else{
                        console.log('No data');
                    }
                }
            });
        })
    }
}

module.exports = Rating;
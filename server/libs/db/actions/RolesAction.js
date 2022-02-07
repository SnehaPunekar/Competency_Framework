const db = require('../../../config/config');

class Roles{
    constructor(){
    }

    GetRoles = async function(){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('SELECT role_id, role_name FROM role;',(err,result)=>{
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
}

module.exports = Roles;
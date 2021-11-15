const db = require('../../../config/config');

class LoginAction{

    constructor(){

    }

    Login = async function(username, password){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('SELECT Emp_id,first_name,last_name,username,password,role,flogin FROM employee where username = ? AND password = ?',
            [username,password],
            (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }else{
                    if(result.length > 0){
                        output = result;
                        return resolve({data:result, success:true});
                    }else{
                        console.log('no data');
                        return resolve({data:result, success:false});
                    }
                }
            });
        });
    }

    SetPassword = async function(pass, flogin, Emp_id){
        let output = [];
        return new Promise(function (resolve, reject) {
            db.query('UPDATE employee SET password = ?, flogin = ? WHERE Emp_id = ? ',[pass,flogin,parseInt(Emp_id)],
            (error,result)=>{
                if(error){
                    console.log(error);
                    return reject(error);
                }else{
                    if(result.length > 0){
                        output = result;
                    }else{
                        console.log('no data');
                    }
                    return resolve({data:result, success:true});
                }
            });
        });
    }
 
}

module.exports = LoginAction;
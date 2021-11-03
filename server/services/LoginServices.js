const Login = require('../libs/db/actions/LoginAction');

class LoginServices{

    constructor(){
        this.getLogin = new Login();
    }

    getLoginDetail = async function(username, password) {
        let response = await this.getLogin.Login(username, password);
        return response;
    }

    setPasswordDetail = async function(pass, flogin, Emp_id) {
        let response = await this.getLogin.SetPassword(pass, flogin, Emp_id);
        return response;
    } 

}
module.exports = LoginServices;

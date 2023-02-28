const User = require('./userController');
const {md5} = require('../../modules');

async function login(username, password){
    let status = false;
    try {
        let controller = new User();
        let user = await controller.getByUsername(username);
        user.logged = true;
        await controller.updateUser(username,user);
        status = true; 

    } catch (error) {
        status = false;
        console.log('====================================');
        console.log('Error at authController.\nError info: ' + error);
        console.log('====================================');
    }
    return status;
}

async function register(username){
    let status = false;
    try {

        let controller = new User();
        const user = {
            "name" : username,
            "logged": true
        }
        await controller.addUser(user);
        status = true;

    } catch (error) {
        status = false;
        console.log('====================================');
        console.log('Error at authController.\nError info: ' + error);
        console.log('====================================');
    }
    return status;
}

module.exports = {
    login,
    register
}
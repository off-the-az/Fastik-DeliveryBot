const User = require('./userController');
const {md5} = require('../../modules/encryptionModule');

async function login(username){
    let lvl = 0;
    try {
        let controller = new User();
        let user = await controller.getByUsername(username);
        user.logged = true;
        await controller.updateUser(username,{logged: true});
        lvl = user.user_lvl; 
    } catch (error) {
        lvl = 0;
        console.log('====================================');
        console.log('Error at authController.\nError info: ' + error);
        console.log('====================================');
    }
    return lvl;
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
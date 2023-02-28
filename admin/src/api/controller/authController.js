const User = require('./userController');
const {md5} = require('../../modules');

async function login(username){
    let lvl = 0;
    try {
        let controller = new User();
        let user = await controller.getByUsername(username);
        user.logged = true;
        await controller.updateUser(username,user);
        lvl = user.user_lvl; 
    } catch (error) {
        lvl = 0;
        console.log('====================================');
        console.log('Error at authController.\nError info: ' + error);
        console.log('====================================');
    }
    return lvl;
}

module.exports = {
    login,
}
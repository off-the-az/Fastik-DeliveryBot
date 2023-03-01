const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');

class MenuRestController{
    async readMenuFromShop() {
        return await readJson('restaurant.json');
    }
}



module.exports = MenuRestController;
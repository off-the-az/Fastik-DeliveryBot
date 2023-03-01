const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');

class MenuShopController{
    async readMenuFromShop() {
        return await readJson('shops.json');
    }
}



module.exports = MenuShopController;
const fs = require('fs');
const path = require('path');

class MenuShopController{
    async readMenuFromShop() {
        return await readJson('shops.json');
    }
}



module.exports = MenuShopController;
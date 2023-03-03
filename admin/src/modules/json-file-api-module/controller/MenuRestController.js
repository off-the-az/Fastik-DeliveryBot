const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');

class MenuRestController{
    async readMenuFromShop() {
        return await readJson('restaurant.json');
    }
    async addItemToMenuFromRest(shop, item){
        return await addProductsToShop('shops.json', shop, item);
    }
    async addRestToMenuFromRest(shop, item){
        return await addProductsToShop('shops.json', shop, item);
    }
}



module.exports = MenuRestController;
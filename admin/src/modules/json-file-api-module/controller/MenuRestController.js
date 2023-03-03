const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');
const {addProductsToShop, addShop} = require('../service/addInfoTo');

class MenuRestController{
    async readMenuFromShop() {
        return await readJson('restaurant.json');
    }
    async addItemToMenuFromRest(shop, item){
        return await addProductsToShop('restaurant.json', shop, item);
    }
    async addRestToMenuFromRest(shop, item){
        return await addShop('restaurant.json', shop);
    }
}



module.exports = MenuRestController;
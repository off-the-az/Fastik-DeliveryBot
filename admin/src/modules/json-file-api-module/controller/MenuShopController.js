const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');
const addProductsToShop = require('../service/addInfoTo');

class MenuShopController{
    async readMenuFromShop() {
        return await readJson('shops.json');
    }
    async addItemToMenuFromShop(shop, item){
        return await addProductsToShop('shops.json', shop, item);
    }
    async addShopToMenuFromShop(shop){
        return await addProductsToShop('shops.json', shop);
    }
}



module.exports = MenuShopController;
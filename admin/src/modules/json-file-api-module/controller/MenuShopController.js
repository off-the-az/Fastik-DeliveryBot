const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');
const {addProductsToShop, addShop} = require('../service/addInfoTo');
const {updateProductsToShop, updateShop} = require('../service/updateInfroTo');

class MenuShopController{
    async readMenuFromShop() {
        return await readJson('shops.json');
    }
    async addItemToMenuFromShop(shop, item){
        return await addProductsToShop('shops.json', shop, item);   
    }
    async addShopToMenuFromShop(shop){
        return await addShop('shops.json', shop);
    }
    async updateItemOnMenuFromShop(shop, item){
        return await updateProductsToShop('shops.json', shop, item);
    }
    async updateShopOnMenuFromShop(shop){
        return await updateShop('shops.json', shop);
    }
}



module.exports = MenuShopController;
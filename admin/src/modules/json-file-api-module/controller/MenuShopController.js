const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');

class MenuShopController{
    async readMenuFromShop() {
        return await readJson('shops.json');
    }
    async addItemToMenuFromShop(shop, item){
        let data = await readJson('shops.json');
        let result = data.shops.filter(itemfromData => itemfromData.name === shop);
        console.log(result + " - " + typeof result);
    }
}



module.exports = MenuShopController;
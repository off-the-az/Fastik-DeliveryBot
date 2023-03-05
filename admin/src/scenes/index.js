const { Scenes } =  require("telegraf");
const setAdminScene = require('./setAdminScene');
const setCourierScene = require('./setCourierScene');
const addProductWithPhoto = require('./addProductWithPhoto');
const addShopScene = require('./addShopScene');

let stage = new Scenes.Stage([setAdminScene, setCourierScene, addProductWithPhoto, addShopScene]);

module.exports = stage;
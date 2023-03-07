const { Scenes } =  require("telegraf");
const setAdminScene = require('./setAdminScene');
const setCourierScene = require('./setCourierScene');
const addProductWithPhoto = require('./addProductWithPhoto');
const addShopScene = require('./addShopScene');
const setCardNumberScene = require('./setCardNumberScene');

let stage = new Scenes.Stage([setAdminScene, setCourierScene, addProductWithPhoto, addShopScene, setCardNumberScene]);

module.exports = stage;
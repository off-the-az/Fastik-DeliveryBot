const { Scenes } =  require("telegraf");
const setAdminScene = require('./setAdminScene');
const setCourierScene = require('./setCourierScene');
const addProductWithPhoto = require('./addProductWithPhoto');

let stage = new Scenes.Stage([setAdminScene, setCourierScene, addProductWithPhoto]);

module.exports = stage;
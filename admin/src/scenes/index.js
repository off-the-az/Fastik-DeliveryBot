const { Scenes } =  require("telegraf");
const setAdminScene = require('./setAdminScene');
const setCourierScene = require('./setCourierScene');

let stage = new Scenes.Stage([setAdminScene, setCourierScene]);

module.exports = stage;
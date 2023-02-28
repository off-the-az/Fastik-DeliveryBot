const { Scenes } =  require("telegraf");
const pnumberScene = require('./pnumberScene');
const initBasketScene = require('./initBasketScene');
const nameScene = require('./setNameScene');
const setPayTypeScene = require('./setPayTypeScene');

let stage = new Scenes.Stage([initBasketScene, pnumberScene, nameScene, setPayTypeScene]);

module.exports = stage;
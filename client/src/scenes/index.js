const { Scenes } =  require("telegraf");
const setAddressScene = require('./setAdress');
const nameScene = require('./setNameScene');
const pnumberScene = require('./pnumberScene');
const initBasketScene = require('./initBasketScene');
const setPayTypeScene = require('./setPayTypeScene');
const setCommentaryScene = require('./setCommentaryScene');
const sendBusketPhotoScene = require('./sendBusketPhotoScene');

let stage = new Scenes.Stage([initBasketScene, pnumberScene, nameScene, setPayTypeScene, setCommentaryScene, sendBusketPhotoScene, setAddressScene]);

module.exports = stage;
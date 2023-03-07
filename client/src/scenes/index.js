const { Scenes } =  require("telegraf");
const pnumberScene = require('./pnumberScene');
const initBasketScene = require('./initBasketScene');
const nameScene = require('./setNameScene');
const setPayTypeScene = require('./setPayTypeScene');
const setCommentaryScene = require('./setCommentaryScene');
const sendBusketPhotoScene = require('./sendBusketPhotoScene');

let stage = new Scenes.Stage([initBasketScene, pnumberScene, nameScene, setPayTypeScene, setCommentaryScene, sendBusketPhotoScene]);

module.exports = stage;
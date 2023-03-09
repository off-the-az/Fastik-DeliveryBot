const { Scenes } =  require("telegraf");
const nameScene = require('./setNameScene');
const pnumberScene = require('./pnumberScene');
const setAddressScene = require('./setAdress');
const setPayTypeScene = require('./setPayTypeScene');
const initBasketScene = require('./initBasketScene');
const setCommentaryScene = require('./setCommentaryScene');
const sendBusketPhotoScene = require('./sendBusketPhotoScene');
const addCommnetToOrderScene = require('./addCommnetToOrderScene');

let stage = new Scenes.Stage([initBasketScene, pnumberScene, nameScene, setPayTypeScene, setCommentaryScene, sendBusketPhotoScene, setAddressScene, addCommnetToOrderScene]);

module.exports = stage;
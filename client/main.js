const { session, Telegraf } =  require("telegraf");
require('dotenv').config()
const stage = require('./src/scenes/index');
const readCommandsText = require('./src/commands/textCommands');
const readCommandsButton = require('./src/commands/buttonCommands');
const readCommandsAction = require('./src/commands/actionCommands');

const bot = new Telegraf(process.env.TOKEN,{
    telegram: { 
      webhookReply: false, 
      concurrent: 5000 
    }
});

bot.use(session());
bot.use(stage.middleware());

readCommandsText(bot);
readCommandsButton(bot);
readCommandsAction(bot);

bot.launch();
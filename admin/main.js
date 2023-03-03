const { session, Telegraf } =  require("telegraf");
require('dotenv').config()

const {User} = require('./src/api/controller/index');
const {courier_menu_btn, admin_menu_btn} = require('./src/models/buttons');
const readButtonCommands = require('./src/commands/buttonCommands');
const stage = require('./src/scenes/index');
const MenuShopController = require("./src/modules/json-file-api-module/controller/MenuShopController");

const bot = new Telegraf(process.env.TOKEN);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
    await new MenuShopController().addItemToMenuFromShop(1, {"id": 1, "name": "2", "photo": "-", "price": 250})
    await new MenuShopController().addShopToMenuFromShop('Kopiyochka')
    let res = await new MenuShopController().readMenuFromShop();
    console.log(res.shops[2]);

    let Users = new User();
    let user = await Users.getByUsername(ctx.chat.id);
    let lvl = user.user_lvl;
    console.log(typeof user.user_lvl);
    lvl === 1 ? 
        await ctx.reply(`Вітаю, ${ctx.chat.first_name}🤗\nЛаскаво просимо вас в Кур'єр-Панель системи 'Fastik'. Оберіть пункт з меню через який ви бажаєте працювати із системою😊`, {reply_markup: courier_menu_btn}) : 
        lvl === 2 ? 
            await ctx.reply(`Вітаю, ${ctx.chat.first_name}🤗\nЛаскаво просимо вас в Адмін-Панель системи 'Fastik'. Оберіть пункт з меню через який ви бажаєте працювати із системою😊`, {reply_markup: admin_menu_btn}) : 
                await ctx.reply('Упс...😕\nСхоже ви не маєте прав доступу до системи. Якщо бажаєте стати частинкою нашої команди натискай "Хочу в команду 🙋" і передай необхідні дані адміністрації 😉', {
                    reply_markup:{
                        keyboard:[
                            ["Хочу в команду 🙋"],
                        ],
                        resize_keyboard: true, 
                        is_persistent: true
                    }
                })
});

readButtonCommands(bot);

bot.launch();
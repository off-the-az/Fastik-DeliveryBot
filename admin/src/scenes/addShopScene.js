const { Scenes } =  require("telegraf");
const {admin_menu_btn} = require('../models/buttons');
const MenuRestController = require("../modules/json-file-api-module/controller/MenuRestController");
const MenuShopController = require("../modules/json-file-api-module/controller/MenuShopController");

const addShopScene = new Scenes.BaseScene('addShop');

let buttons = ["Ресторани", "Магазини"];
let from = "";

addShopScene.enter(async ctx => {
    await ctx.reply('Обери категорію закладів де ти будеш додавати новий заклад:', {
        reply_markup: {
            keyboard:[
                ["Ресторани"],
                ["Магазини"]
            ],
            resize_keyboard: true,
            remove_keyboard: true,
            one_time_keyboard: true
        },
    });
})

addShopScene.hears(buttons.map(button => button), async ctx =>{
    switch (ctx.message.text) {
        case "Ресторани":
            from = "rest";
            await ctx.reply('Вкажи назву закладу котрий ти будеш додавати:');
            break;
        case "Магазини":
            from = "shop";
            await ctx.reply('Вкажи назву закладу котрий ти будеш додавати:');
            break;
        default:
            console.log(ctx.message.text);
            break;
    }
})

addShopScene.on('message', async ctx => {
    if(from === "shop"){
        await new MenuShopController().addShopToMenuFromShop(ctx.message.text);
    }else{
        await new MenuRestController().addRestToMenuFromRest(ctx.message.text);
    }
    await ctx.scene.leave('addShop')
})

addShopScene.leave(async ctx => {
    await ctx.reply('Заклад успішно додано!', {
        reply_markup: admin_menu_btn
    });
    console.log('Leave');
})

module.exports = addShopScene;
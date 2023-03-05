const { Scenes } =  require("telegraf");
const Telegraf = require('telegraf');
const path = require('path');
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const MenuRestController = require("../modules/json-file-api-module/controller/MenuRestController");
const MenuShopController = require("../modules/json-file-api-module/controller/MenuShopController");
const {downloadFile} = require('../modules/photo-api-module/saveFile');

const addProductScene = new Scenes.BaseScene('addProduct');

let shop_id = 0;
let from = "";


let buttons = ["Ресторани", "Магазини"];
function getGenTypeKeyboard(type, fromList) {
    return Telegraf.Markup.inlineKeyboard(
        fromList.shops.map((item) => {
            return [Telegraf.Markup.button.callback(`${item.name}`, `add_to_${type}_${item.id}`)];
        })
    );
}

addProductScene.enter(async ctx => {
    await ctx.reply('Обери категорію закладів де ти будеш додавати новий товар:', {
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

addProductScene.action(/add_to_(.+)_(.+)/, async ctx => {
    const [type, id] = ctx.match.slice(1);
    await ctx.deleteMessage();
    from = String(type);
    shop_id = isNaN(Number(id)) != true ? Number(id) : 1
    await ctx.reply('Надішли фото із описом до нього у вигляді згідно прикладу. Зауважте що інші способи внесення даних призведе до різноманітних помилок в системі і різноманітних проблем.\n\n(Приклад внесення даних про товар)\nНазва: Товар 123\nЦіна: 123456789', {
        reply_markup:{
            remove_keyboard: true,
        }
    });
})

addProductScene.hears(buttons.map(button => button), async ctx =>{
    switch (ctx.message.text) {
        case "Ресторани":
            ctx.state.menu = await new MenuRestController().readMenuFromShop();
            await ctx.reply('Обери заклад де ти будеш додавати новий товар:', getGenTypeKeyboard("rest", ctx.state.menu));
            break;
        case "Магазини":
            ctx.state.menu = await new MenuShopController().readMenuFromShop();
            await ctx.reply('Обери заклад де ти будеш додавати новий товар:', getGenTypeKeyboard("shop", ctx.state.menu));
            break;
        default:
            console.log(ctx.message.text);
            break;
    }
})

addProductScene.on('photo', async ctx => {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const caption = ctx.message.caption || '';
    const fileUrl = await ctx.telegram.getFileLink(photo.file_id);
    const filename = `${photo.file_unique_id}.jpg`;
    const filepath = path.join(process.cwd(), '..', 'MenuDB', 'assets', filename);
    var properties = caption.split('\n');
    ctx.state.obj = {};
    properties.forEach(function(property) {
        var tup = property.split(': ');
        tup[0] = tup[0] === 'Назва' ? 'name' : tup[0] === 'Ціна' ? 'price' : 'name';
        ctx.state.obj[tup[0]] = tup[1];
    });
    ctx.state.obj['id'] = 0;
    ctx.state.obj['photo'] = filepath;
    await downloadFile(fileUrl.href, filepath);
    if(from === "shop"){
        await new MenuShopController().addItemToMenuFromShop(shop_id, ctx.state.obj);
    }else{
        await new MenuRestController().addItemToMenuFromRest(shop_id, ctx.state.obj);
    }
})

addProductScene.leave(async ctx => {
    console.log('Leave');
})

module.exports = addProductScene;
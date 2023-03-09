const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');

const addCommnetToOrderScene = new Scenes.BaseScene('addCommnetToOrder');
let type = "adress";

addCommnetToOrderScene.enter(async ctx => {
    await ctx.reply('Вкажи примітку до власного замовлення 😉', {reply_markup:{
        inline_keyboard: [
            [
                {
                    text: "Не вказувати примітку", 
                    callback_data: "cancel_commit"
                }
            ]
        ]
    }});
})

addCommnetToOrderScene.action('cancel_commit', async (ctx) => {
    ctx.scene.leave('addCommnetToOrder');
})

addCommnetToOrderScene.hears(/(.+)/, async ctx => {
    const [commit] = ctx.match.slice(1);
    console.log(commit);
    let controller = new User();
    await controller.updateUser(ctx.chat.id, {sec_info: String(addCommnetToOrder)});
    await ctx.reply('Інформацію оновлено успішно ✅');
    ctx.scene.leave('addCommnetToOrder');
})

addCommnetToOrderScene.leave(async ctx => {
    await ctx.reply('Натисни "Продовжити ▶️" і будемо завершувати оформлення замовлення😉', {reply_markup:{
        inline_keyboard: [
            [
                {
                    text: "Продовжити ▶️", 
                    callback_data: "finish_order"
                }
            ]
        ]
    }});
})

module.exports = addCommnetToOrderScene;
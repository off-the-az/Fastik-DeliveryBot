const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');

const nameScene = new Scenes.BaseScene('setName');
let type = "adress";

nameScene.enter(async ctx => {
    await ctx.reply('Вкажи своє ім\'я, аби знати як до тебе звертатись😉', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
})

nameScene.hears(/(.+)/, async ctx => {
    const [name] = ctx.match.slice(1);
    console.log(name);
    let controller = new User();
    await controller.updateUser(ctx.chat.username, {client_name: String(name)});
    ctx.scene.leave('setName');
})

nameScene.leave(async ctx => {
    await ctx.reply('Інформацію оновлено успішно✅\nНатисни "Продовжити ▶️" і будемо рухатись далі😉', {reply_markup:{
        inline_keyboard: [
            [
                {
                    text: "Продовжити ▶️", 
                    callback_data: "cont_reg"
                }
            ]
        ]
    }});
})

module.exports = nameScene;
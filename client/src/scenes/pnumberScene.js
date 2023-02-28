const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const Telegraf = require('telegraf')

const pnumberScene = new Scenes.BaseScene('setNumber');

pnumberScene.enter(async ctx => {
    await ctx.reply('Поділись своїм номером телефону, щоби із тобою міг в майбутньому зв\'язатись кур\'єр', {
        reply_markup: {
          keyboard: [
            [
              {
                text: "📲 Поділитись номером",
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
          remove_keyboard: true,
          resize_keyboard: true,
        },
      });
})

pnumberScene.on('contact', async (ctx) => {
    const phoneNumber = ctx.message.contact.phone_number
    let Users = new User();
    await Users.updateUser(ctx.chat.username, {pnumber: String(phoneNumber)});
    await ctx.scene.leave('setNumber');
  })

pnumberScene.leave(async ctx => {
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

module.exports = pnumberScene;
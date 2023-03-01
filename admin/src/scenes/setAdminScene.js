const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');

const nameScene = new Scenes.BaseScene('setAdmin');

nameScene.enter(async ctx => {
    await ctx.reply('Вкажи унікальний номер користувача аби я зміг йому надати права', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
})

nameScene.hears(/(.+)/, async ctx => {
    const [id] = ctx.match.slice(1);
    console.log(id);
    let controller = new User();
    await controller.updateUser(id, {user_lvl: 2});
    ctx.scene.leave('setAdmin');
})

nameScene.leave(async ctx => {
    await ctx.reply('Інформацію оновлено успішно✅');
})

module.exports = nameScene;
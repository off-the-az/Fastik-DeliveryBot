const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');

const nameScene = new Scenes.BaseScene('setCourier');

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
    let user = controller.getByUsername(id);
    if(user.user_lvl === 2){
        await controller.updateUser(id, {user_lvl: 1});
        await ctx.reply('Права доступу даного користувача із попереднім рівнем прав доступу "Адміністратор" успішно понижено до рівня "Курʼєр"✅');
        await ctx.scene.leave('setAdmin');
    }else if(user.user_lvl === 1){
        await ctx.reply('Такий користувач у нас вже існує і має дані права доступу');
        await ctx.scene.leave('setAdmin');
    }else{
        await controller.updateUser(id, {user_lvl: 1});
        await ctx.reply('Інформацію оновлено успішно✅');
        await ctx.scene.leave('setAdmin');
    }
})

nameScene.leave(async ctx => {
    console.log('Leave');
})

module.exports = nameScene;
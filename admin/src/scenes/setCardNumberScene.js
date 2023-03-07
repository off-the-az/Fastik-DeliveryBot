const { Scenes } =  require("telegraf");
const {admin_menu_btn} = require('../models/buttons');

const setCardNumberScene = new Scenes.BaseScene('setCardNumber');

setCardNumberScene.enter(async ctx => {
    await ctx.reply('Вкажи новий номер карти для переказу коштів(без пробілів):');
})

setCardNumberScene.on('message', async ctx => {
    if(isNaN(Number(ctx.update.message.text)) != true){
        console.info(Number(ctx.update.message.text));
        await ctx.reply('', {reply_markup: admin_menu_btn});
    }else{
        await ctx.reply('Сталась помилка! Спробуй ще раз!', {reply_markup: admin_menu_btn});
    }
    await ctx.scene.leave('setCardNumber')
})

setCardNumberScene.leave(async ctx => {
    console.log('Leave');
})

module.exports = setCardNumberScene;
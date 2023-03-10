const { Scenes } =  require("telegraf");
const {busket_menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const cmdList = require('../models/cmd.list.json');

const setAddressScene = new Scenes.BaseScene('setAddress');

setAddressScene.enter(async ctx => {
    console.log('Enter adress');
})

setAddressScene.on('message', async (ctx) => {
    let controller = new User();
    if(String(ctx.message.text) != cmdList.buttons.map(button => button.name)){
        await controller.updateUser(ctx.chat.id, {adress: String(ctx.message.text)});
        let user = await controller.getByUsername(ctx.chat.id);
        await ctx.reply('Інформацію оновлено успішно✅\n' + `Натисни ще раз 'Оформити замовлення 📝' аби завершити оформлення замолення😉`, {reply_markup:busket_menu_btn})
    }
    await ctx.scene.leave('setAddress');
})

setAddressScene.leave(ctx => {
    console.log('Leave')
})

module.exports = setAddressScene;
const { Scenes } =  require("telegraf");
const {busket_menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const cmdList = require('../models/cmd.list.json');

const setAddressScene = new Scenes.BaseScene('setAddress');

setAddressScene.enter(async ctx => {
    console.log('Enter adress');
})

setAddressScene.hears(/(.+)/, async ctx => {
    const [adress] = ctx.match.slice(1);
    let controller = new User();
    if(String(adress) != cmdList.buttons.map(button => button.name)){
        await controller.updateUser(ctx.chat.id, {adress: String(adress)});
        let user = await controller.getByUsername(ctx.chat.id);
        await ctx.reply('Інформацію оновлено успішно✅\n' + `Натисни ще раз 'Оформити замовлення 📝' аби завершити оформлення замолення😉`, {reply_markup:busket_menu_btn})
    }
    await ctx.scene.leave('setAddress');
})

setAddressScene.leave(ctx => {
    console.log('Leave')
})

module.exports = setAddressScene;
const {User, Ticket} = require('../api/controller/index');
const {busket_menu_btn} = require('../models/buttons');
const cmdList = require('../models/cmd.list.json');

async function getAdress(bot){
    /*bot.hears(/(.+)/, async ctx => {
        const [adress] = ctx.match.slice(1);
        let controller = new User();
        if(String(adress) != cmdList.buttons.map(button => button.name)){
            await controller.updateUser(ctx.chat.id, {adress: String(adress)});
            let user = await controller.getByUsername(ctx.chat.id);
            await ctx.reply('Інформацію оновлено успішно✅\n' + `Натисни ще раз 'Оформити замовлення 📝' аби завершити оформлення замолення😉`, {reply_markup:busket_menu_btn})
        }
    })*/
}

module.exports = {
    getAdress,
};
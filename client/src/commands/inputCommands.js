const {User, Ticket} = require('../api/controller/index');
const {menu_btn} = require('../models/buttons');

async function getAdress(bot){
    bot.hears(/(.+)/, async ctx => {
        const [adress] = ctx.match.slice(1);
        let controller = new User();
        if(String(adress) != 'Скасувати ❌'){
            await controller.updateUser(ctx.chat.username, {adress: String(adress)});
            let user = await controller.getByUsername(ctx.chat.username);
            await ctx.reply('Інформацію оновлено успішно✅\n' + `Натисни ще раз 'Оформити замовлення 📝' аби завершити оформлення замолення😉`, {reply_markup:menu_btn})
        }else if(String(adress) === 'Скасувати ❌'){
            await ctx.reply('Скасовано 😕❌\nЯкщо бажаєш внести адресу перед оформленням замовлення - натисни "Вказати адресу 🔄"😉\nУ разі якщо хочеш відразу вказати адрес під час оформлення замовлення - натисни "Оформити замовлення 📝" і вкажи адресу під час замовлення доставки😉', {reply_markup: menu_btn});
        }
    })
}

module.exports = {
    getAdress,
};
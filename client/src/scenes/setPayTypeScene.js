const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');

const setPayTypeScene = new Scenes.BaseScene('setpaymethod');
let type = "adress";

setPayTypeScene.enter(async ctx => {
    await ctx.reply('Обери спосіб оплати, через який ти будеш розраховуватись за замовлення. Усі варіанти вказано в нижній панелі під полем де ти вносиш повідомлення', {reply_markup:{
        keyboard: [
            ['Оплата готівкою'],
            ['Оплата картою'],
            ['Передоплата'],
            ['Скасувати ❌']
        ],
        resize_keyboard: true,
    }});
})

setPayTypeScene.hears(/(.+)/, async ctx => {
    const [paymethod] = ctx.match.slice(1);
    let controller = new User();
    if(String(paymethod) != 'Скасувати ❌'){
        type = 'adress'
        await controller.updateUser(ctx.chat.username, {payMethod: String(paymethod)});
        await ctx.scene.leave('setNumber');
    }else if(String(paymethod) === 'Скасувати ❌'){
        type = 'cancel';
        await ctx.scene.leave('setNumber');
    }
})

setPayTypeScene.leave(async ctx => {
    type === 'adress' ?
        await ctx.reply('Інформацію оновлено успішно✅\n' + `Натисни ще раз 'Продовжити ▶️' аби продовжити оформлення замолення😉`, {
            reply_markup: {
                inline_keyboard:[
                    [
                        
                        {text: "Продовжити ▶️", callback_data: "finish_order"}
                    ],
                ]
            }
        })
        : await ctx.reply('Скасовано 😕❌\nЯкщо бажаєш внести спосіб оплати перед оформленням замовлення - натисни "Вказати адресу 🔄"😉\nУ разі якщо хочеш відразу вказати адрес під час оформлення замовлення - натисни "Оформити замовлення 📝" і вкажи адресу під час замовлення доставки😉', {reply_markup: menu_btn});
})

module.exports = setPayTypeScene;
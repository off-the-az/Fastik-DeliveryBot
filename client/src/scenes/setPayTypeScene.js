const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const paymethod = require('../../../MenuDB/paymethod.json')

const setPayTypeScene = new Scenes.BaseScene('setpaymethod');

setPayTypeScene.enter(async ctx => {
    await ctx.reply('Обери спосіб оплати, через який ти будеш розраховуватись за замовлення. Усі варіанти вказано в нижній панелі під полем де ти вносиш повідомлення', {reply_markup:{
        inline_keyboard: [
            [
                {text: 'Оплатити зараз', callback_data: 'pay_now'}
            ],
            [
                {text: 'Оплата кур’єру', callback_data: 'pay_later'}
            ]
        ],
        resize_keyboard: true,
    }});
})

setPayTypeScene.hears(/pay_(.+)/, async ctx => {
    const [paymethod] = ctx.match.slice(1);
    let controller = new User();
    if(String(paymethod) === 'now'){
        await controller.updateUser(ctx.chat.id, {payMethod: 'Оплатити зараз'});
        await ctx.reply('Для того щоби оплатити зараз дане замовлення потрібно зробити переказ на карту за даним реквізитом - ' + Number(paymethod.card_number));
        await ctx.scene.leave('setNumber');
    }else if(String(paymethod) === 'later'){
        await controller.updateUser(ctx.chat.id, {payMethod: 'Оплата кур’єру'});
        await ctx.reply('Замовлення успішно оформлено! Очікуй інформації про замовлення!)');
        await ctx.scene.leave('setNumber');
    }
})

setPayTypeScene.leave(async ctx => {
    console.log('Leave');
})

module.exports = setPayTypeScene;
const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User} = require('../api/controller/index');
const pay_method = require('../../../MenuDB/paymethod.json')

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

setPayTypeScene.action(/pay_(.+)/, async ctx => {
    const [paymethod] = ctx.match.slice(1);
    console.log(paymethod);
    let controller = new User();
    if(String(paymethod) === 'now'){
        ctx.state.pay_type = 'now'
        ctx.state.photo = ''
        ctx.state.pay_time = ''
        await controller.updateUser(ctx.chat.id, {payMethod: 'Оплатити зараз'});
        await ctx.reply('Для того щоби оплатити зараз дане замовлення потрібно зробити переказ на карту за реквізитом та надіслати підтвердження у вигляді фото, де є підтвердження переказу чи точний час виконаного переказу.\nРеквізити для оплати - ' + Number(pay_method.card_number));
    }else if(String(paymethod) === 'later'){
        ctx.state.pay_type = 'later'
        await controller.updateUser(ctx.chat.id, {payMethod: 'Оплата кур’єру'});
        await ctx.reply('Дані успішно оновлено! Завершуй оформлення замовлення, натиснувши ʼПродовжитиʼ!)', {
            reply_markup: {
                inline_keyboard:[
                    [
                        {text: 'Продовжити', callback_data: 'finish_order'}
                    ]
                ]
            }
        });
        ctx.scene.leave('setpaymethod');
    }
})

setPayTypeScene.on('message', async ctx => {
    if(ctx.state.pay_time === 'now'){
        ctx.state.photo = ctx.message.photo.length != 0 || ctx.message.photo != undefined ? ctx.message.photo[ctx.message.photo.length - 1] : '';
        ctx.state.pay_time = ctx.message.text;
        await ctx.reply('Дані успішно оновлено! Завершуй оформлення замовлення, натиснувши ʼПродовжитиʼ!)', {
            reply_markup: {
                inline_keyboard:[
                    [
                        {text: 'Продовжити', callback_data: 'finish_order'}
                    ]
                ]
            }
        });
        ctx.scene.leave('setpaymethod');
    }
});

setPayTypeScene.leave(async ctx => {
    console.log('Leave');
})

module.exports = setPayTypeScene;
const Telegraf = require('telegraf');
const {menu_btn,rest_menu_btn,shop_menu_btn,tomain_inline_btn,busket_menu_btn,} = require('../models/buttons');
const shopList = require('../models/shops');
const restList = require('../models/rest');
const {User, Ticket} = require('../api/controller/index');
const {getAdress} = require('./inputCommands');
const cmdList = require('../models/cmd.list.json');

let numberOfTicketInList = 0;
let userTickets = [];
let list = "";

function countSum(list){
    let sum = 0;
    list.forEach((el) => {
        sum += (el.price * el.amount);
    });
    return sum;
}

function getProductsKeyboard(shopArray, type) {
    return Telegraf.Markup.inlineKeyboard(
        shopArray.products.map((item) => {
            return [Telegraf.Markup.button.callback(`${item.name} - ${item.price} грн.`, `get_${type}_${shopArray.id}_${item.id}`)];
        })
    );
}

function getShopsKeyboard() {
    const keyboard = shopList.map(shop => shop.name);
    return Telegraf.Markup.keyboard(keyboard).resize();
}

function getRestsKeyboard() {
    const keyboard = restList.map(shop => shop.name);
    return Telegraf.Markup.keyboard(keyboard).resize();
}

function readCommandsButton(bot){

    bot.hears(shopList.map(shop => shop.name), (ctx) => {
        const shop = shopList.find(shop => shop.name === ctx.message.text);
        ctx.session.shop = shop;
        ctx.reply(`Обери товари з даного списку що знаходиться під даним повідомленням😌`, getProductsKeyboard(shop, "shop"));
    });

    bot.hears(restList.map(shop => shop.name), (ctx) => {
        const shop = restList.find(shop => shop.name === ctx.message.text);
        ctx.session.shop = shop;
        ctx.reply(`Обери товари з даного списку що знаходиться під даним повідомленням😌`, getProductsKeyboard(shop, "rest"));
    });

    bot.hears(cmdList.buttons.map(button => button.name), async ctx => {
        let controller;
        let data;
        try {
            switch (ctx.update.message.text) {
                case 'Ресторани 🍽️':
                    await ctx.reply( 'Обери заклад харчування у якому ти хочеш замовити. Список закладів у тебе відображаються в нижній частині екрану', getRestsKeyboard())
                    await ctx.reply( 'У разі якщо не бажаєш обирати заклад, ти можеш натиснути кнопку \'Головна🚪\', котра знаходиться під даним повідомленням', {reply_markup:tomain_inline_btn})
                    break;
                case 'Магазини 🏪':
                    await ctx.reply( 'Обери магазин у якому ти хочеш замовити. Список магазинів у тебе відображаються в нижній частині екрану', getShopsKeyboard())
                    await ctx.reply( 'У разі якщо не бажаєш обирати магазин, ти можеш натиснути кнопку \'Головна🚪\', котра знаходиться під даним повідомленням', {reply_markup:tomain_inline_btn})
                    break;
                case 'Кошик 🧺':
                    controller = new User();
                    data = await controller.getByUsername(ctx.chat.username);
                    if(data.busket.length != 0){
                        await ctx.reply( 'Твій кошик виглядає ось так:')
                        let list = "";
                        let i = 0;
                        data.busket.forEach(el => {
                            list += `${++i}) ${el.name} - ${el.price} грн 💸 (${el.amount} шт)\n`;
                        })
                        await ctx.reply( `${list}`)
                        await ctx.reply( 'Обери дію через яку ти будеш взаємодіяти із власним кошиком', {reply_markup:busket_menu_btn})
                    }else{
                        await ctx.reply( 'Нажаль ти ще нічого не додавав у кошик😢', {reply_markup:menu_btn})
                    }
                    break;
                case 'Очистити 🗑️':
                    controller = new User();
                    await controller.updateUser(ctx.chat.username, {busket: []});
                    await ctx.reply('Кошик став порожнім😢', {reply_markup:menu_btn});
                    break;
                case 'Головна 🚪':
                    await ctx.reply('Обери пункт у меню який тобі до вподоби, щоби продовжити користування системою😌', {reply_markup: menu_btn});
                    break;
                case "Вказати адресу 🔄":
                    try {
                        await ctx.reply( 'Перед тим як я оформлю твоє замовлення вкажи свою адресу куди саме потрібно все доставити за прикладом - вул. Симоненка буд 2 кв 41\nУ разі якщо хочеш скасувати внесення адреси - натисни "Скасувати ❌" і тоді повернешся до головного меню😉', {reply_markup:{
                            keyboard: [
                                ['Скасувати ❌']
                            ],
                            resize_keyboard: true,
                        }})
                        await getAdress(bot);
                    } catch (error) {
                        console.log(`Error while edit address. Error: ${error}`);
                    }
                    break;
                case "Оформити замовлення 📝":
                    controller = new User();
                    user = await controller.getByUsername(ctx.chat.username);
                    if(user.busket.length === 0){
                        await ctx.reply( 'Нажаль ти ще нічого не додавав у кошик😢', {reply_markup:menu_btn})
                    }else if(user.adress === ""){
                        await ctx.reply( 'Перед тим як я оформлю твоє замовлення вкажи свою адресу куди саме потрібно все доставити за прикладом - вул. Симоненка буд 2 кв 41\nУ разі якщо хочеш скасувати внесення адреси - натисни "Скасувати ❌" і тоді повернешся до головного меню😉', {reply_markup:{
                            keyboard: [
                                ['Скасувати ❌']
                            ],
                            resize_keyboard: true,
                        }})
                        await getAdress(bot);
                    }else if(user.pnumber === ""){
                        await ctx.scene.enter('setNumber');
                    }else if(user.client_name === ""){
                        await ctx.scene.enter('setName');
                    }else if(user.payMethod === ""){
                        await ctx.scene.enter('setpaymethod');
                    }else{
                        let itemList = "";
                        let i = 0;
                        user.busket.forEach(el => {
                            itemList += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
                        })
                        if(itemList != ""){
                            await ctx.reply( 'Оформляю твоє замовлення')
                            await ctx.reply( 'Твої персональні дані:')
                            await ctx.reply(`Власник: ${user.client_name}\nАдреса доставки: ${user.adress}`)
                            await ctx.reply( 'Твій кошик виглядає ось так:')
                            await ctx.reply( `${itemList}`)
                            await ctx.reply( `До сплати: ${countSum(user.busket)} грн💸`)
                            await ctx.reply( 'Якщо все вірно, натисни "Продовжити ▶️" і замовлення буде оформлено😉\nУ разі якщо адресу вказав неправильно - натисни "Змінити адресу 🔄" аби змінити адресу доставки😌', {
                                reply_markup: {
                                    inline_keyboard:[
                                        [
                                            {text: "Змінити адресу 🔄", callback_data: "reinit_adress"},
                                        ],
                                        [
                                            
                                            {text: "Продовжити ▶️", callback_data: "finish_order"}
                                        ],
                                    ]
                                }
                            })
                        }else{
                            await ctx.reply( 'Нажаль ти ще нічого не додавав у кошик😢', {reply_markup:menu_btn})
                        }
                    }
                    break;
                case 'Історія покупок 📒':
                    let tickets = new Ticket();
                    userTickets = await tickets.getByUsername(`@${ctx.chat.username}%20(${ctx.chat.first_name}%20${ctx.chat.last_name != undefined ? ctx.chat.last_name : '\b'})`);
                    list = "";
                    if(userTickets.length != 0){
                        let i = 0;
                        userTickets[numberOfTicketInList].itemlist.forEach(el => {
                            list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
                        })
                        await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\n\nКур'єр: ${userTickets[numberOfTicketInList].courier != "" ? '@'+userTickets[numberOfTicketInList].courier : "В очікуванні на кур'єра ⌛"}\n\nЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
                            {
                                reply_markup: {
                                    inline_keyboard: numberOfTicketInList != 0 ? [
                                        [
                                            {text: "◀️", callback_data: "previous"},
                                            {text: "▶️", callback_data: "next"}
                                        ]
                                    ] : [
                                        [
                                            {text: "▶️", callback_data: "next"}
                                        ]
                                    ],
                                    resize_keyboard: true
                                }
                            }
                        );
                    }else{
                        await ctx.reply(`Ти ще нічого не замовляв😕`);
                    }
                    break;
                default:
                    console.log(ctx);
                    break;
            }
        } catch (error) {
            console.log(`Error info: ${error}`);
        }
    });
}

module.exports = readCommandsButton;
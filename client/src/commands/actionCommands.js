const Telegraf = require('telegraf');
require('dotenv').config();
const creds = require('../models/fastik-gsheet.json');
const {menu_btn} = require('../models/buttons');
const shopList = require('../../../MenuDB/shops.json');
const restList = require('../../../MenuDB/restaurant.json');
const {User, Ticket} = require('../api/controller/index');
const {getAdress} = require('./inputCommands');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('1RT3cT9YWAlAX0QMIxx8XIVJ2SRz8CqsHSVdhrKxK2vU');


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

function readCommandsAction(bot){

    bot.hears('pay_now', async ctx => {
        await controller.updateUser(ctx.chat.id, {payMethod: 'Оплатити зараз'});
        await ctx.reply('Для того щоби оплатити зараз дане замовлення потрібно зробити переказ на карту за даним реквізитом - ' + Number(paymethod.card_number));
        await ctx.scene.leave('setNumber');
        /*const [paymethod] = ctx.match.slice(1);
        console.log(paymethod);
        let controller = new User();
        if(String(paymethod) === 'now'){
            
        }else if(String(paymethod) === 'later'){
            await controller.updateUser(ctx.chat.id, {payMethod: 'Оплата кур’єру'});
            await ctx.reply('Замовлення успішно оформлено! Очікуй інформації про замовлення!)');
            await ctx.scene.leave('setNumber');
        }*/
    })

    bot.action('cont_reg', async (ctx) => {
        let Users = new User();
        let user = await Users.getByUsername(ctx.chat.id);
        if(user === undefined){
            await Auth.register(ctx.chat.id)
        }
        if(user.pnumber === ""){
            await ctx.reply('Бачу, щось пішло не так коли ти вводив свій номер телефону😕\nЩо ж давай це виправимо😉');
            await ctx.scene.enter('setNumber');
        }else if(user.client_name === ""){
            await ctx.scene.enter('setName');
        }else{
            await ctx.reply('Дякую за роботу, все що потрібно було мені - отримано, ти молодець😉\nОбери пункт у меню який тобі до вподоби, щоби продовжити користування системою😌', {reply_markup: menu_btn});
        }
    })

    bot.action('previous', async (ctx) => {
        await ctx.deleteMessage();
        if(numberOfTicketInList+1 < 1){
            numberOfTicketInList = 0;
        }else{
            --numberOfTicketInList;
        }
        list = "";
        let tickets = new Ticket();
        userTickets = await tickets.getByUsername(`@${ctx.chat.id}%20(${ctx.chat.first_name}%20${ctx.chat.last_name != undefined ? ctx.chat.last_name : '\b'})`);
        if(userTickets.length != 0){
            let i = 0;
            userTickets[numberOfTicketInList].itemlist.forEach(el => {
                list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
            })
            await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\n\nКур'єр: @${userTickets[numberOfTicketInList].courier != "" ? '@'+userTickets[numberOfTicketInList].courier : "В очікуванні на кур'єра ⌛"}\n\nЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
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
        }
    });
    bot.action('next', async (ctx) => {
        await ctx.deleteMessage();
        if(userTickets.length <= numberOfTicketInList+1){
            numberOfTicketInList = userTickets.length - 1;
        }else ++numberOfTicketInList;
        list = "";
        let tickets = new Ticket();
        userTickets = await tickets.getByUsername(`@${ctx.chat.id}%20(${ctx.chat.first_name}%20${ctx.chat.last_name != undefined ? ctx.chat.last_name : '\b'})`);
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
        }
    });
    bot.action('main', async (ctx) => {
        await ctx.reply('Обери пункт у меню який тобі до вподоби, щоби продовжити користування системою😌', {reply_markup: menu_btn});
    });

    bot.action('reinit_adress', async (ctx) => {
        await ctx.deleteMessage();
        await ctx.reply( 'Перед тим як я оформлю твоє замовлення вкажи свою адресу куди саме потрібно все доставити за прикладом - вул. Симоненка буд 2 кв 41 😉')
        await getAdress(bot);
    });

    bot.action('finish_order', async (ctx) => {
        await ctx.deleteMessage();
        let Tickets = new Ticket();
        let Users = new User();
        user = await Users.getByUsername(ctx.chat.id)
        if(user.pnumber === ""){
            await ctx.scene.enter('setNumber');
        }else if(user.client_name === ""){
            await ctx.scene.enter('setName');
        }else if(user.payMethod === ""){
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
        }else{
            await doc.useServiceAccountAuth(creds);
            let string_busket = ""
            let i = 0;
            user.busket.forEach(item => {
                string_busket += `${++i}) ${item.name} - ${item.price} грн/о.т (${item.amount}шт).\n`
            })
            let date = new Date();
            let result = await Tickets.addTicket({
                itemlist: user.busket,
                owner: user.client_name,
                adress: user.adress,
                pnumber: user.pnumber,
                tPrice: countSum(user.busket),
                from: user.busket[0].from,
                payMethod: user.payMethod,
                date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${data.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:${date.getSeconds()}`,
            });
            let tickets = await Tickets.getAllByStatus(0);
            let ticket;
            tickets.forEach(row => {
                let compInfo = String(row.date);
                if(compInfo === result.date && row.owner === result.owner){
                    ticket = row;
                }
            });
            const raw = {
                'Унікальний номер чеку': ticket._id,
                'Покупець': ticket.owner,
                'Кошик': string_busket,
                'Заклад': ticket.from,
                'Адреса доставки': ticket.adress,
                'Номер телефону клієнта': ticket.pnumber,
                'Сумма': ticket.tPrice,
                'Спосіб оплати': ticket.payMethod,
                'Дата замовлення': ticket.date,
                'Кур\'єр': ticket.courier,
                'Статус': 'Складаємо замовлення',
            };
            await doc.loadInfo();
            const sheet = doc.sheetsById[434269134];
            await sheet.addRow(raw);
            
            await Users.updateUser(ctx.chat.id, {busket: [], adress: "", payMethod: ""})
            await ctx.reply('Замовлення успішно оформленно✅\nЩоб переглянути замовлення натисни - "Історія покупок 📒" і дізнайся деталі кожного твого замовлення😌', {reply_markup: menu_btn});    
        }
    })

    bot.action(/add_(.+)_(.+)_(.+)/, async (ctx) => {
        const [list, shop_id, item_id] = ctx.match.slice(1);
        await ctx.deleteMessage();
        const controller = new User();
        const data = await controller.getByUsername(ctx.chat.id);
        let basket = data.busket;
        if(list === "shop"){
            const shop = shopList.shops.find(shops => shops.id === Number(shop_id));
            const item = shop.products.find(products => products.id === Number(item_id))
            if(basket.length != 0){
                if(basket[0].from != shop.name){
                    await ctx.reply(`Ти можеш замовляти товари виключно в '${basket[0].from}'`, {reply_markup: menu_btn});
                }else{
                    basket.push(
                        {
                            "name": item.name,
                            "price": item.price,
                            "amount": 0,
                            "from": shop.name
                        }
                    );
                    await controller.updateUser(ctx.chat.id, {busket: basket});
                    await ctx.scene.enter('initBasket');
                }
            }else{
                basket.push(
                    {
                        "name": item.name,
                        "price": item.price,
                        "amount": 0,
                        "from": shop.name
                    }
                );
                await controller.updateUser(ctx.chat.id, {busket: basket});
                await ctx.scene.enter('initBasket');
            }
            
        }else if (list === "rest"){
            const shop = restList.shops.find(shops => shops.id === Number(shop_id));
            const item = shop.products.find(products => products.id === Number(item_id))
            if(basket.length != 0){
                if(basket[0].from != shop.name){
                    await ctx.reply(`Ти можеш замовляти товари виключно в '${basket[0].from}'`, {reply_markup: menu_btn});
                }else{
                    basket.push(
                        {
                            "name": item.name,
                            "price": item.price,
                            "amount": 0,
                            "from": shop.name
                        }
                    );
                    await controller.updateUser(ctx.chat.id, {busket: basket});
                    await ctx.scene.enter('initBasket');
                }
            }else{
                basket.push(
                    {
                        "name": item.name,
                        "price": item.price,
                        "amount": 0,
                        "from": shop.name
                    }
                );
                await controller.updateUser(ctx.chat.id, {busket: basket});
                await ctx.scene.enter('initBasket');
            }
            
        }
    })
    
    bot.action(/get_list_(.+)_(.+)/, async (ctx) => {
        await ctx.deleteMessage();
        const [list, shop_id, item_id] = ctx.match.slice(1);
        if(list === "shop"){
            const shop = shopList.shops.find(shops => shops.id === Number(shop_id));
            ctx.session.shop = shop;
            ctx.reply(`Обери товари з даного списку що знаходиться під даним повідомленням😌`, getProductsKeyboard(shop, "shop"));
        }else if (list === "rest"){
            const shop = restList.shops.find(shops => shops.id === Number(shop_id));
            ctx.session.shop = shop;
            ctx.reply(`Обери товари з даного списку що знаходиться під даним повідомленням😌`, getProductsKeyboard(shop, "rest"));
        }
    })

    bot.action(/get_(.+)_(.+)_(.+)/, async (ctx) => {
        const [list, shop_id, item_id] = await ctx.match.slice(1);
        console.log(`get_${list}_${shop_id}_${item_id}`);
        await ctx.deleteMessage();
        if(list === "shop"){
            const shop = await shopList.shops.find(shops => shops.id === Number(shop_id));
            const item = await shop.products.find(products => products.id === Number(item_id))
            await ctx.sendPhoto(
                {
                    source: item.photo
                },
                {
                    caption:  `${item.name}\nЦіна:${item.price} грн`,
                    reply_markup: {
                        inline_keyboard:[
                            [
                                {text: "У кошик 🗑️", callback_data: `add_${list}_${shop_id}_${item_id}`}
                            ],
                            [
                                {text: "Інші товари 📝", callback_data: `get_list_${list}_${shop_id}`}
                            ]
                        ]
                    }
                }
            );
        }else if (list === "rest"){
            const shop = await restList.shops.find(shops => shops.id === Number(shop_id));
            const item = await shop.products.find(products => products.id === Number(item_id))
            await ctx.sendPhoto(
                {
                    source: `${item.photo}`
                },
                {
                    caption:  `${item.name}\nЦіна:${item.price}грн`,
                    reply_markup: {
                        inline_keyboard:[
                            [
                                {text: "У кошик 🗑️", callback_data: `add_${list}_${shop_id}_${item_id}`}
                            ],
                            [
                                {text: "Інші товари 📝", callback_data: `get_list_${list}_${shop_id}`}
                            ]
                        ]
                    }
                }
            );
        }
    })
}

module.exports = readCommandsAction;
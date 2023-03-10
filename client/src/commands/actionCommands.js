require('dotenv').config();
const axios = require('axios');
const Telegraf = require('telegraf');
const FormData = require('form-data');
const {menu_btn} = require('../models/buttons');
const creds = require('../models/fastik-gsheet.json');
const shopList = require('../../../MenuDB/shops.json');
const {User, Ticket} = require('../api/controller/index');
const restList = require('../../../MenuDB/restaurant.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');


const bot_sender = '5986688122:AAGfiCiyNIX_2shqSolWn-LtC0owxobDPAw';
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
    bot.action('send_busket_photo', async ctx => {
        await ctx.scene.enter('sendBusketPhoto');
    })
    bot.action('call_me', async ctx => {
        let Users = new User();
        let user = await Users.getByUsername(String(ctx.chat.id));
        const caption = `#перетелефонуй_мені\n\nІм'я: ${user.client_name}\nНомер телефону: ${user.pnumber}`;
        const form = new FormData();
        form.append('chat_id', 	-1001819835850);
        form.append('text', caption);
        axios.post(`https://api.telegram.org/bot${bot_sender}/sendMessage`, form, {
            headers: form.getHeaders()
        })
        .then(async data => {
            await ctx.reply('Повідомлення менеджеру надіслано! Очікуйте виклику від менеджера');
        })
        .catch(async err => {
            await ctx.reply('Щось пішло не так! Повторіть спробу');
            console.log(err);
        });
    })
    bot.action('main', async (ctx) => {
        await ctx.reply('Обери пункт у меню який тобі до вподоби, щоби продовжити користування системою😌', {reply_markup: menu_btn});
    });
    bot.action('reinit_adress', async (ctx) => {
        await ctx.reply( 'Перед тим як я оформлю твоє замовлення вкажи свою адресу куди саме потрібно все доставити за прикладом - вул. Симоненка буд 2 кв 41 😉')
        await ctx.scene.enter('setAddress');
    });
    bot.action('reinit_pnumber', async (ctx) => {
        await ctx.scene.enter('setNumber');
    });
    bot.action('finish_order', async (ctx) => {
        let Tickets = new Ticket();
        let Users = new User();
        user = await Users.getByUsername(ctx.chat.id)
        if(user.pnumber === ""){
            await ctx.scene.enter('setNumber');
        }else if(user.client_name === ""){
            await ctx.scene.enter('setName');
        }else if(user.adress === ""){
            await ctx.scene.enter('setAddress');
        }else{
            await ctx.scene.enter('setpaymethod');
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
                    await ctx.reply(`Ти можеш замовляти товари виключно в закладі '${basket[0].from}'\nОднак ти можеш очистити кошик і оформити заново дане замовлення або оформити замовлення із тим набором товарів котрі ти додав раніше 😉`, {reply_markup: menu_btn});
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
                    await ctx.reply(`Ти можеш замовляти товари виключно в закладі '${basket[0].from}'\nОднак ти можеш очистити кошик і оформити заново дане замовлення або оформити замовлення із тим набором товарів котрі ти додав раніше 😉`, {reply_markup: menu_btn});
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
    bot.action(/send_comment_(.+)/, async (ctx) => {
        const [ticket_id] = ctx.match.slice(1);
        let Tickets = new Ticket();
        let ticket = await Tickets.getById(ticket_id);
        if(ticket.status != 2){
            await ctx.reply('Дане замовлення поки що не доставлене!');
        }
        else{
            ctx.state.ticket = ticket_id;
            await ctx.scene.enter('setCommentary');
        }
    })
    bot.action('set_comment_to_order', async ctx =>{
        await ctx.scene.enter('addCommnetToOrder');
    })
    bot.action(/accept_order_(.+)/, async (ctx) => {
        const [ticket_id] = ctx.match.slice(1);
        let Tickets = new Ticket();
        await Tickets.updateTicket(ticket_id, {status: 0})
        await ctx.reply('Замовлення №'+ ticket_id +' підтвердженно');
    })
}

module.exports = readCommandsAction;
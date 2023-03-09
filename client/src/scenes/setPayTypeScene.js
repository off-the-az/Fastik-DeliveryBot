const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {User, Ticket} = require('../api/controller/index');
const pay_method = require('../../../MenuDB/paymethod.json')
const axios = require('axios');
const FormData = require('form-data');
const creds = require('../models/fastik-gsheet.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const bot_sender = '5986688122:AAGfiCiyNIX_2shqSolWn-LtC0owxobDPAw';
const doc = new GoogleSpreadsheet('1RT3cT9YWAlAX0QMIxx8XIVJ2SRz8CqsHSVdhrKxK2vU');
const setPayTypeScene = new Scenes.BaseScene('setpaymethod');

function countSum(list){
    let sum = 0;
    list.forEach((el) => {
        sum += (el.price * el.amount);
    });
    return sum;
}

let method_type = ''
let pay_time = ''

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
    await ctx.deleteMessage();
    let Tickets = new Ticket();
    let Users = new User();
    if(String(paymethod) === 'now'){
        method_type = 'now'
        await ctx.reply('Для того щоби оплатити зараз дане замовлення потрібно зробити переказ на карту за реквізитом та надіслати підтвердження у вигляді фото, де є підтвердження переказу чи точний час виконаного переказу.\nРеквізити для оплати - ' + Number(pay_method.card_number));
    }else if(String(paymethod) === 'later'){
        await ctx.reply('Оформляю твоє замовлення...');
        await doc.useServiceAccountAuth(creds);
        let user = await Users.getByUsername(ctx.chat.id)
        let string_busket = ""
        let i = 0;
        user.busket.forEach(item => {
            string_busket += `${++i}) ${item.name} - ${item.price} грн/о.т (${item.amount}шт).\n`
        })
        let date = new Date();
        let result = await Tickets.addTicket({
            itemlist: user.busket,
            owner: user.client_name + ' - ' + ctx.chat.id,
            adress: user.adress,
            pnumber: user.pnumber,
            tPrice: countSum(user.busket),
            from: user.busket[0].from,
            payMethod: 'Оплата кур’єру',
            sec_info: user.sec_info,
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:${date.getSeconds()}`,
        });
        let tickets = await Tickets.getAllByStatus(-1);
        let ticket;
        tickets.forEach(row => {
            let compInfo = String(row.date);
            if(compInfo === result.date && row.owner === result.owner){
                ticket = row;
            }
        });
        
        const caption = `#замовлення\n\nІм'я: ${user.client_name}\nНомер телефону: ${ticket.pnumber}\nКошик:\n${string_busket}\nЗаклад: ${ticket.from}\nСума до сплати: ${ticket.tPrice}\nСпосіб оплати: ${ticket.payMethod}\nПримітка до замовлення: ${user.sec_info}`;
        axios.post(`https://api.telegram.org/bot${bot_sender}/sendMessage`, {
            chat_id: -1001819835850,
            text: caption,
            reply_markup: {inline_keyboard:[[{text: 'Підтвердити замовлення', callback_data: `accept_order_${ticket._id}`}]]},
        })
        .then(async data => {
            const raw = {
                'Унікальний номер чеку': ticket._id,
                'Покупець': user.client_name,
                'Кошик': string_busket,
                'Заклад': ticket.from,
                'Примітка': ticket.sec_info,
                'Адреса доставки': ticket.adress,
                'Номер телефону клієнта': ticket.pnumber,
                'Сумма': ticket.tPrice,
                'Спосіб оплати': ticket.payMethod,
                'Дата замовлення': ticket.date,
                'Кур\'єр': ticket.courier,
                'Статус': 'Очікує підтвердження',
                'Оцінка': 0,
            };
            await doc.loadInfo();
            const sheet = doc.sheetsById[434269134];
            await sheet.addRow(raw);
            await Users.updateUser(ctx.chat.id, {busket: [], payMethod: "", sec_info: ""})
            await ctx.reply('Замовлення успішно оформленно✅\nОЧікуй підтвердження від менеджера!\nЩоб переглянути замовлення натисни - "Історія покупок 📒" і дізнайся деталі кожного твого замовлення😌', {reply_markup: menu_btn}); 
        })
        .catch(async err => {
            await ctx.reply('Щось пішло не так! Повторіть спробу');
            console.log(err);
        });
        
        ctx.scene.leave('setpaymethod');
    }
})

setPayTypeScene.on('photo', async ctx => {
    console.log('Now with ' + method_type);
    let Tickets = new Ticket();
    let Users = new User();
    if(method_type === 'now'){
        let photo = ctx.message.photo.length != 0 || ctx.message.photo != undefined ? ctx.message.photo[ctx.message.photo.length - 1] : '';
        await ctx.reply('Оформляю твоє замовлення...');
        await doc.useServiceAccountAuth(creds);
        let user = await Users.getByUsername(ctx.chat.id)
        let string_busket = ""
        let i = 0;
        user.busket.forEach(item => {
            string_busket += `${++i}) ${item.name} - ${item.price} грн/о.т (${item.amount}шт).\n`
        })
        let date = new Date();
        let result = await Tickets.addTicket({
            itemlist: user.busket,
            owner: user.client_name + ' - ' + ctx.chat.id,
            adress: user.adress,
            pnumber: user.pnumber,
            tPrice: countSum(user.busket),
            from: user.busket[0].from,
            payMethod: 'Оплатити зараз',
            sec_info: user.sec_info,
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()-1}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:${date.getSeconds()}`,
        });
        let tickets = await Tickets.getAllByStatus(-1);
        let ticket;
        tickets.forEach(row => {
            let compInfo = String(row.date);
            if(compInfo === result.date && row.owner === result.owner){
                ticket = row;
            }
        });
        
        const caption = `#замовлення\n\nІм'я: ${user.client_name}\nНомер телефону: ${ticket.pnumber}\nКошик:\n${string_busket}\nЗаклад: ${ticket.from}\nСума до сплати: ${ticket.tPrice}\nСпосіб оплати: ${ticket.payMethod}\nПримітка до замовлення: ${user.sec_info}`;
        axios.post(`https://api.telegram.org/bot${bot_sender}/sendPhoto`, {
            chat_id: -1001819835850,
            photo: photo.file_id,
            caption: caption,
            reply_markup: {inline_keyboard:[[{text: 'Підтвердити замовлення', callback_data: `accept_order_${ticket._id}`}]]},
        })
        .then(async data => {
            const raw = {
                'Унікальний номер чеку': ticket._id,
                'Покупець': user.client_name,
                'Кошик': string_busket,
                'Заклад': ticket.from,
                'Примітка': ticket.sec_info,
                'Адреса доставки': ticket.adress,
                'Номер телефону клієнта': ticket.pnumber,
                'Сумма': ticket.tPrice,
                'Спосіб оплати': ticket.payMethod,
                'Дата замовлення': ticket.date,
                'Кур\'єр': ticket.courier,
                'Статус': 'Очікує підтвердження',
                'Оцінка': 0,
            };
            await doc.loadInfo();
            const sheet = doc.sheetsById[434269134];
            await sheet.addRow(raw);
            await Users.updateUser(ctx.chat.id, {busket: [], payMethod: "", sec_info: ""})
            await ctx.reply('Замовлення успішно оформленно✅\nОЧікуй підтвердження від менеджера!\nЩоб переглянути замовлення натисни - "Історія покупок 📒" і дізнайся деталі кожного твого замовлення😌', {reply_markup: menu_btn}); 
        })
        .catch(async err => {
            await ctx.reply('Щось пішло не так! Повторіть спробу');
            console.log(err);
        });
        
        ctx.scene.leave('setpaymethod');
    }
});

setPayTypeScene.on('text', async ctx => {
    console.log('Now with ' + method_type);
    let Tickets = new Ticket();
    let Users = new User();
    if(method_type === 'now'){
        await ctx.reply('Оформляю твоє замовлення...');
        await doc.useServiceAccountAuth(creds);
        let user = await Users.getByUsername(ctx.chat.id)
        let string_busket = ""
        let i = 0;
        user.busket.forEach(item => {
            string_busket += `${++i}) ${item.name} - ${item.price} грн/о.т (${item.amount}шт).\n`
        })
        let date = new Date();
        let result = await Tickets.addTicket({
            itemlist: user.busket,
            owner: user.client_name + ' - ' + ctx.chat.id,
            adress: user.adress,
            pnumber: user.pnumber,
            tPrice: countSum(user.busket),
            from: user.busket[0].from,
            payMethod: 'Оплатити зараз',
            sec_info: user.sec_info,
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()-1}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:${date.getSeconds()}`,
        });
        let tickets = await Tickets.getAllByStatus(-1);
        let ticket;
        tickets.forEach(row => {
            let compInfo = String(row.date);
            if(compInfo === result.date && row.owner === result.owner){
                ticket = row;
            }
        });
        
        const caption = `#замовлення\n\nІм'я: ${user.client_name}\nНомер телефону: ${ticket.pnumber}\nКошик:\n${string_busket}\nЗаклад: ${ticket.from}\nСума до сплати: ${ticket.tPrice}\nСпосіб оплати: ${ticket.payMethod}\nПримітка до замовлення: ${user.sec_info}`;
        axios.post(`https://api.telegram.org/bot${bot_sender}/sendMessage`, {
            chat_id: -1001819835850,
            text: caption + `\n\nЧас оплати: ${ctx.message.text}`,
            reply_markup: {inline_keyboard:[[{text: 'Підтвердити замовлення', callback_data: `accept_order_${ticket._id}`}]]},
        })
        .then(async data => {
            const raw = {
                'Унікальний номер чеку': ticket._id,
                'Покупець': user.client_name,
                'Кошик': string_busket,
                'Заклад': ticket.from,
                'Примітка': ticket.sec_info,
                'Адреса доставки': ticket.adress,
                'Номер телефону клієнта': ticket.pnumber,
                'Сумма': ticket.tPrice,
                'Спосіб оплати': ticket.payMethod,
                'Дата замовлення': ticket.date,
                'Кур\'єр': ticket.courier,
                'Статус': 'Очікує підтвердження',
                'Оцінка': 0,
            };
            await doc.loadInfo();
            const sheet = doc.sheetsById[434269134];
            await sheet.addRow(raw);
            await Users.updateUser(ctx.chat.id, {busket: [], payMethod: "", sec_info: ""})
            await ctx.reply('Замовлення успішно оформленно✅\nОЧікуй підтвердження від менеджера!\nЩоб переглянути замовлення натисни - "Історія покупок 📒" і дізнайся деталі кожного твого замовлення😌', {reply_markup: menu_btn}); 
        })
        .catch(async err => {
            await ctx.reply('Щось пішло не так! Повторіть спробу');
            console.log(err);
        });
        
        ctx.scene.leave('setpaymethod');
    }
});

setPayTypeScene.leave(async ctx => {
    console.log(ctx.state.pay_type);   
    console.log('Leave');
})

module.exports = setPayTypeScene;
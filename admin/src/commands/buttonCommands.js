const Telegraf = require('telegraf');
require('dotenv').config();
const cmdList = require('../models/cmd.list.json');
const typeList = require('../models/type.excel.file.json');
const {Ticket, User} = require('../api/controller/index');

let userTickets = [];
let numberOfTicketInList = 0;
let list = "";

function getGenTypeKeyboard() {
    return Telegraf.Markup.inlineKeyboard(
        typeList.types.map((item) => {
            return [Telegraf.Markup.button.callback(`${item.name}`, `generate_type_${item.type}`)];
        })
    );
}

function readButtonCommands(bot){

    bot.hears(cmdList.buttons.map(button => button.name), async ctx => {
        switch(ctx.message.text){
            case 'Витяг із замовленнями 📝':
                await ctx.reply('Оберіть формат витягу нижче аби я зміг сформувати Excel-таблицю:', getGenTypeKeyboard());
                break;
            case "Персонал 🗂️":
                await ctx.reply('In progress');
                break;
            case "Товари 🗄️":
                await ctx.reply('In progress'); 
                break;
            case "Хочу в команду 🙋":
                let Users = new User();
                let user = await Users.getByUsername(ctx.chat.id);
                await ctx.reply(`Щоби стати частинкою команди, ти повинен зв'язатись із адміністрацією даної служби доставки та надати свій унікальний номер в базі користувачів\nТвій унікальний номер - ${user.name}`, {reply_markup:{
                    remove_keyboard: true,
                }}); 
                break;
            case 'Взяти замовлення 📝':
                showFreeTickets(ctx);
                break;
            case "Мої замовлення 📒":
                showReservedTickets(ctx);
                break;
            default: 
                console.log(ctx.meassage.text);
                break;
        }
    })
}


async function showReservedTickets(ctx){
    let Tickets = new Ticket();
    data = await Tickets.getAllByStatus(1)
    let Users = new User();
    let user = await Users.getByUsername(ctx.chat.id);
    console.log(user.name+"("+user.client_name+")");
    userTickets = data.filter(ticket => ticket.courier === user.name+"("+user.client_name+")");
    if(userTickets.length != 0){
        let i = 0;
        list = "";
        console.log(userTickets[numberOfTicketInList].itemlist);
        userTickets[numberOfTicketInList].itemlist.forEach(el => {
            list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
        })
        await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\n\nВласник: ${userTickets[numberOfTicketInList].owner}\n\nЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
            {
                reply_markup: {
                    inline_keyboard: numberOfTicketInList != 0 ? [
                        [
                            {text: "◀️", callback_data: "previous_book"},
                            {text: "▶️", callback_data: "next_book"}
                        ],
                        [
                            {text: "Підтвердити доставку ✅", callback_data: `finish_delivery_${userTickets[numberOfTicketInList]._id}`},
                        ]
                    ] : [
                        [
                            {text: "▶️", callback_data: "next_book"}
                        ],
                        [
                            {text: "Підтвердити доставку ✅", callback_data: `finish_delivery_${userTickets[numberOfTicketInList]._id}`},
                        ]
                    ],
                    resize_keyboard: true
                }
            }
        );
    }else{
        await ctx.reply(`Нажаль ти ще нічого не доставляєш 😕`);
    }
}


async function showFreeTickets(ctx){
    let Tickets = new Ticket();
    userTickets = await Tickets.getAllByStatus(0)
    if(userTickets.length != 0){
        let i = 0;
        list = "";
        userTickets[numberOfTicketInList].itemlist.forEach(el => {
            list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
        })
        await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\nВласник: ${userTickets[numberOfTicketInList].owner}\n\nНомер телефону: ${userTickets[numberOfTicketInList].pnumber}\n\nАдреса доставки: ${userTickets[numberOfTicketInList].date}\n\nСЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
            {
                reply_markup: {
                    inline_keyboard: numberOfTicketInList != 0 ? [
                        [
                            {text: "◀️", callback_data: "previous"},
                            {text: "▶️", callback_data: "next"}
                        ],
                        [
                            {text: "Взяти замовлення ✅", callback_data: `finish_booking_${userTickets[numberOfTicketInList]._id}`},
                        ]
                    ] : [
                        [
                            {text: "▶️", callback_data: "next"}
                        ],
                        [
                            {text: "Взяти замовлення ✅", callback_data: `finish_booking_${userTickets[numberOfTicketInList]._id}`},
                        ]
                    ],
                    resize_keyboard: true
                }
            }
        );
    }else{
        await ctx.reply(`Нажаль замовлень немає(😕`);
    }
}

module.exports = readButtonCommands;
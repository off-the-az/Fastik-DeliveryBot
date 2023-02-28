const Telegraf = require('telegraf');
require('dotenv').config();
const ExcelJS = require('exceljs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const cmdList = require('../models/cmd.list.json');
const typeList = require('../models/type.excel.file.json');
const {Ticket, User} = require('../api/controller/index');
const { courier_menu_btn } = require('../models/buttons');

const doc = new GoogleSpreadsheet(process.env.GS_SpreadSheetID);

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

    bot.action(/generate_type_(.+)/, async ctx => {
        const [type] = await ctx.match.slice(1);
        await generateExcelFileByParam(ctx, type);
    });

    bot.action(/finish_booking_(.+)/, async (ctx) => {
        const [ticket_id] = await ctx.match.slice(1);
        await ctx.deleteMessage();
        await doc.useServiceAccountAuth({
            client_email: process.env.GS_client_email,
            private_key: process.env.GS_private_key.split(String.raw`\n`).join('\n'),
        });
        try {
            let Tickets = new Ticket();
            let Users = new User();
            let user = await Users.getByUsername(ctx.chat.username);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows();
            let rowToUpdate;
            rows.forEach((row) => {
                if((row._rawData[0] === ticket_id) || (row._rawData[0].localeCompare(ticket_id))){
                    rowToUpdate = row;
                }
            });
            
            rowToUpdate._rawData[10] = 'Очікує доставки';
            rowToUpdate._rawData[9] = user.name + "(" + user.client_name + ")";
            console.log(rowToUpdate._rawData);
            await rowToUpdate.save();
            await Tickets.updateTicket(ticket_id, {courier: user.name + "(" + user.client_name + ")", status: 1});
            await ctx.reply('Замовлення успішно присвоєно тобі ✅\nЩоби переглянути інформацію про замовлення, котрі ти взяв - натисни ʼМої замовлення 📒ʼ\n\nПотрібно доставити як найшвидше!\nНе змушуй клієнта тебе лаяти😌', {reply_markup: courier_menu_btn});
        } catch (error) {
            console.log('====================================');
            console.log(`Error while finishing order. Error: ${error}`);
            console.log('====================================');
        }
    })

    bot.action(/finish_delivery_(.+)/, async (ctx) => {
        const [ticket_id] = await ctx.match.slice(1);
        await ctx.deleteMessage();
        await doc.useServiceAccountAuth({
            client_email: process.env.GS_client_email,
            private_key: process.env.GS_private_key.split(String.raw`\n`).join('\n'),
        });
        try {
            let Tickets = new Ticket();
            await Tickets.updateTicket(ticket_id, {status: 2});
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows();
            let rowToUpdate;
            rows.forEach((row) => {
                if((row._rawData[0] === ticket_id) || (row._rawData[0].localeCompare(ticket_id))){
                    rowToUpdate = row;
                }
            });
            rowToUpdate._rawData[10] = 'Доставлено';
            console.log(rowToUpdate._rawData);
            await rowToUpdate.save();
            await ctx.reply('Замовлення успішно доставлено ✅\nТак тримати, колего!😌', {reply_markup: courier_menu_btn});
        } catch (error) {
            console.log('====================================');
            console.log(`Error while finishing order. Error: ${error}`);
            console.log('====================================');
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
        let Tickets = new Ticket();
        userTickets = await Tickets.getAllByStatus(0)
        if(userTickets.length != 0){
            let i = 0;
            list = "";
            userTickets[numberOfTicketInList].itemlist.forEach(el => {
                list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
            })
            await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\n\nВласник: ${userTickets[numberOfTicketInList].owner}\n\nЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
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
        }
        
    });
    bot.action('next', async (ctx) => {
        await ctx.deleteMessage();
        if(userTickets.length <= numberOfTicketInList+1){
            numberOfTicketInList = userTickets.length - 1;
        }else ++numberOfTicketInList;
        list = "";
        let Tickets = new Ticket();
        userTickets = await Tickets.getAllByStatus(0)
        if(userTickets.length != 0){
            let i = 0;
            list = "";
            userTickets[numberOfTicketInList].itemlist.forEach(el => {
                list += `${++i}) ${el.name} - ${el.price} grn (${el.amount} шт)\n`;
            })
            await ctx.reply(`Індекс замовлення: ${userTickets[numberOfTicketInList]._id}\n\nДата замовлення: ${userTickets[numberOfTicketInList].date}\n\nСписок замовлених товарів:\n\n${list}\n\nВласник: ${userTickets[numberOfTicketInList].owner}\n\nЗагальна ціна: ${userTickets[numberOfTicketInList].tPrice} грн💸\n\nСтатус замовлення: ${userTickets[numberOfTicketInList].status === 0 ? 'Очікує підтвердження ⌛' : userTickets[numberOfTicketInList].status === 1 ? 'Очікує доставлення🚗' : 'Доставлено✅'}`,
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
        }
    });

    bot.action('previous_book', async (ctx) => {
        await ctx.deleteMessage();
        if(numberOfTicketInList+1 < 1){
            numberOfTicketInList = 0;
        }else{
            --numberOfTicketInList;
        }
        list = "";
        let Tickets = new Ticket();
        data = await Tickets.getAllByStatus(1)
        userTickets = data.filter(ticket => ticket.courier === ctx.chat.username);
        if(userTickets.length != 0){
            let i = 0;
            list = "";
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
        }
        
    });
    bot.action('next_book', async (ctx) => {
        await ctx.deleteMessage();
        if(userTickets.length <= numberOfTicketInList+1){
            numberOfTicketInList = userTickets.length - 1;
        }else ++numberOfTicketInList;
        list = "";
        let Tickets = new Ticket();
        data = await Tickets.getAllByStatus(1)
        userTickets = data.filter(ticket => ticket.courier === ctx.chat.username);
        if(userTickets.length != 0){
            let i = 0;
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
        }
    });

    bot.hears(cmdList.buttons.map(button => button.name), async ctx => {
        switch(ctx.message.text){
            case 'Витяг із замовленнями 📝':
                await ctx.reply('Оберіть формат витягу нижче аби я зміг сформувати Excel-таблицю:', getGenTypeKeyboard());
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

async function generateExcelFileByParam(ctx, type){
    switch(type){
        case 'getAll':
            await ctx.deleteMessage();
            await ctx.reply('Генерую файл...\nОчікуй на файл😉');
            let Tickets = new Ticket();
            let tickets = await Tickets.getAllByStatus(2);
            let string_busket = ""
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`${new Date().getDate()}-${new Date().getMonth()+ 1}-${new Date().getFullYear()}`);
            worksheet.addRow(['TicketID', 'Buyer', 'Busket', 'Total Price', 'Date', 'Courier']);
            let i = 0;
            let totalSum = 0;
            tickets.forEach(ticket => {
                string_busket = ""
                console.log(ticket.itemlist);
                ticket.itemlist.forEach(item => {
                    string_busket += `${++i}) ${item.name} - ${item.price} грн/о.т (${item.amount}шт). Заклад: ${item.from}\n`
                })
                worksheet.addRow([ticket._id, ticket.pnumber + "(" + ticket.owner + ")", string_busket, ticket.tPrice, ticket.date, ticket.courier]);
                totalSum += ticket.tPrice;
            });
            workbook.xlsx.writeBuffer()
                .then(async buffer => {
                    await ctx.reply('Файл згенеровано успішно ✅');
                    await ctx.replyWithDocument({
                        source: buffer,
                        filename: `Звіт ${new Date().getDate()}-${new Date().getMonth()+ 1}-${new Date().getFullYear()}` + '.xlsx'
                    });
                })
                .catch(error => {
                    console.log(error);
                    ctx.reply('Під час експорту даних виникла помилка.');
                });
            break;
        default:
            console.log(type);
            break;
    }
}

async function showReservedTickets(ctx){
    let Tickets = new Ticket();
    data = await Tickets.getAllByStatus(1)
    let Users = new User();
    let user = await Users.getByUsername(ctx.chat.username);
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
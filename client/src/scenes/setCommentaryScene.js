const { Scenes } =  require("telegraf");
const {menu_btn} = require('../models/buttons');
const {Ticket} = require('../api/controller/index');
const cmdList = require('../models/cmd.list.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../models/fastik-gsheet.json');

const doc = new GoogleSpreadsheet("1RT3cT9YWAlAX0QMIxx8XIVJ2SRz8CqsHSVdhrKxK2vU");

const setCommentaryScene = new Scenes.BaseScene('setCommentary');

setCommentaryScene.enter(async ctx => {
    await ctx.reply('Вкажи оцінку від 1 до 5');
})

setCommentaryScene.on('text', async ctx => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    let rowToUpdate;
    rows.forEach((row) => {
        if((row._rawData[0] === ctx.state.ticket) || (row._rawData[0].localeCompare(ctx.state.ticket))){
            rowToUpdate = row;
        }
    });
    
    if(ctx.update.message.text != cmdList.buttons.map(button => button.name)){
        rowToUpdate._rawData[11] = ctx.message.text;
        console.log(rowToUpdate._rawData);
        await rowToUpdate.save();
        await controller.updateTicket(ctx.state.ticket, {commentary: isNaN(Number(ctx.update.message.text)) != true ? Number(ctx.update.message.text) : 1});
        await ctx.reply( 'Інформацію оновлено успішно✅\nМожеш обрати щось іще додатково аби наповнити свій кошик новими товарами😊\nА якщо бажаєш оформити своє замовлення - натисни `Оформити📝` і оформлюй замовлення😉', {reply_markup:menu_btn});
        ctx.scene.leave('setCommentary');
    }
})

setCommentaryScene.leave(ctx => {
    console.log('Leave')
})

module.exports = setCommentaryScene;
const { Scenes } =  require("telegraf");
const axios = require('axios');
const FormData = require('form-data');
const {User} = require('../api/controller/index');
const {menu_btn} = require('../models/buttons');

const sendBusketPhotoScene = new Scenes.BaseScene('sendBusketPhoto');
const bot_sender = '5986688122:AAGfiCiyNIX_2shqSolWn-LtC0owxobDPAw';

sendBusketPhotoScene.enter(async ctx => {
    await ctx.reply('Надішли нам фото/скрін де вказано, що саме ти хочеш у нас замовити і ми з часом звʼяжемось задля уточнень 😉');
})

sendBusketPhotoScene.on('photo', async ctx => {
    let Users = new User();
    let user = await Users.getByUsername(String(ctx.chat.id));
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const caption = `Прийшло нове замовлення\nІм'я: ${user.client_name}\nНомер телефону: +${user.pnumber}`;
    const form = new FormData();
    form.append('chat_id', 	-1001819835850);
    form.append('photo', photo.file_id);
    console.info(photo.file_id);
    form.append('caption', caption);
    await axios.post(`https://api.telegram.org/bot${bot_sender}/sendPhoto`, form, {
        headers: form.getHeaders()
    }).then(async data => {
        await ctx.reply('Фото із кошиком успішно відправлено✅\nОчікуй на дзвіночок від менеджера 😉');
    }).catch(async (err) => {
        console.error(err);
        ctx.scene.leave('sendBusketPhoto');
    });
    ctx.scene.leave('sendBusketPhoto');
})

sendBusketPhotoScene.leave(ctx => {
    console.log('Leave')
})

module.exports = sendBusketPhotoScene;
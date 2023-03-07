const { Scenes } =  require("telegraf");
const axios = require('axios');
const FormData = require('form-data');
const {User} = require('../api/controller/index');
const {menu_btn} = require('../models/buttons');

const sendBusketPhotoScene = new Scenes.BaseScene('sendBusketPhoto');

sendBusketPhotoScene.enter(async ctx => {
    await ctx.reply('Надішли нам фото/скрін де вказано, що саме ти хочеш у нас замовити і ми з часом звʼяжемось задля уточнень 😉');
})

sendBusketPhotoScene.on('photo', async ctx => {
    let Users = new User();
    let user = await Users.getByUsername(String(ctx.chat.id));
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const caption = `Ім'я: ${user.client_name}\nНомер телефону: +${user.pnumber}`;
    const form = new FormData();
    form.append('chat_id', 5612131198); // FIXME: Need to change chat_id to Admin chat_id
    form.append('photo', photo.file_id);
    form.append('caption', caption);
    await axios.post(`https://api.telegram.org/bot6072101802:AAFnz6QLR4YssmqLeVMaRSAy5oA5bPd4AkU/sendPhoto`, form, {
        headers: form.getHeaders()
    }).then(async data => {
        await ctx.reply('Фото із кошиком успішно відправлено✅\nОчікуй на дзвіночок від менеджера 😉');
    });
    await ctx.reply( 'Відгук надіслано успішно✅\nСподіваюсь тобі сподобався наш сервіс😉', {reply_markup:menu_btn});
    ctx.scene.leave('sendBusketPhoto');
})

sendBusketPhotoScene.leave(ctx => {
    console.log('Leave')
})

module.exports = sendBusketPhotoScene;
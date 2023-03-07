let menu_btn = {keyboard: [["Ресторани 🍽️", "Магазини 🏪"], ["Кошик 🧺","Історія покупок 📒"], ["Замовити з фото кошика 🧺"], ["Вказати адресу 🔄"], ["Оформити замовлення 📝"]],resize_keyboard: true, is_persistent: true};
let busket_menu_btn = {keyboard: [[ "Оформити замовлення 📝"], ["Вказати адресу 🔄"], ["Очистити 🗑️", "Головна 🚪"]],resize_keyboard: true, is_persistent: true};
let tomain_inline_btn = {inline_keyboard: [[{text: "Головна 🚪", callback_data: "main"}]]};

module.exports = {
    menu_btn,
    tomain_inline_btn,
    busket_menu_btn,
}
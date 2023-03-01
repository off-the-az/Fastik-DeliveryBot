let admin_menu_btn = {keyboard: [["Витяг із замовленнями 📝"], ["Персонал 🗂️","Товари 🗄️"]],resize_keyboard: true, is_persistent: true};
let courier_menu_btn = {keyboard: [["Взяти замовлення 📝"], ["Мої замовлення 📒"]],resize_keyboard: true, is_persistent: true};
let tomain_inline_btn = {inline_keyboard: [[{text: "Головна 🚪", callback_data: "main"}]]};

module.exports = {
    tomain_inline_btn,
    admin_menu_btn,
    courier_menu_btn,
}
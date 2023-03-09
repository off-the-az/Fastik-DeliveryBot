const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        unique: true,
    },
    client_name: {
        type: String,
        default: "",
    },
    pnumber: {
        type: String,
        default: "",
    },
    password: {
        type: String,
    },
    busket:{
        type: {},
        default: []
    },
    payMethod:{
        type: String,
        default: ""
    },
    adress: {
        type: String,
        default: ""
    },
    logged: {
        type: Boolean,
        default: false
    },
    user_lvl: {
        type: Number,
        default: 0
    },
    sec_info: {
        type: String,
        default: "Відсутня"
    },
})

module.exports = mongoose.model('User', User)
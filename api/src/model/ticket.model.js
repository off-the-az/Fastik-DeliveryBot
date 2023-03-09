const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema({
    itemlist: {
        type: {},
        required: true
    },
    from:{
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true,
    },
    pnumber:{
        type: String,
        required: true,
    },
    tPrice: {
        type: Number,
        required: true
    },
    payMethod: {
        type: String,
        required: true
    },
    courier: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: ""
    },
    status: {
        type: Number,
        default: -1
    },
    commentary: {
        type: Number,
        default: 0
    },
    sec_info: {
        type: String,
        default: "Відсутня"
    },
})

module.exports = mongoose.model('Ticket', Ticket)
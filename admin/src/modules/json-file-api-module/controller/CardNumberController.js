const fs = require('fs');
const path = require('path');
const readJson = require('../service/readFileService');
const {addCardNumber} = require('../service/addInfoTo');

class CardNumberController{
    async addCardNumber(cnumber){
        return await addCardNumber({"card_number": cnumber});
    }
}



module.exports = CardNumberController;
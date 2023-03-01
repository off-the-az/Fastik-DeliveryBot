const shopList = require('../../../MenuDB/shops.json');
const fs = require('fs');
const path = require('path');

async function readMenuFromShop(params) {
    console.log(await readJson('shops.json'));
}

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
      const filepath = path.join(process.cwd(), '..', 'MenuDB', filename);
      fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
};

const readJson = async (filename) => {
    const data = await readFile(filename);
    return JSON.parse(data);
};

module.exports = readMenuFromShop;
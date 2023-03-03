const fs = require('fs');
const util = require('util');
const path = require('path');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function addProductsToShop(file, shopId, newProducts) {
  try {
    // Read the JSON file
    const filepath = path.join(process.cwd(), '..', 'MenuDB', file);
    const data = await readFileAsync(filepath);
    const json = JSON.parse(data);

    // Find the shop by ID
    const shopIndex = json.shops.findIndex(shop => shop.id === shopId);
    if (shopIndex === -1) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }

    // Add the new products to the shop
    json.shops[shopIndex].products.push(newProducts);

    // Write the updated JSON back to the file
    await writeFileAsync(filepath, JSON.stringify(json));

    console.log(`Added ${newProducts} products to shop ${shopId}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = addProductsToShop;
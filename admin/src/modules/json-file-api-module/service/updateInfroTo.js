const fs = require('fs');
const util = require('util');
const path = require('path');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function updateProductsToShop(file, shopId, newProducts) {
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
    json.shops.forEach(from => {
        if(from.id === shopId){
            from.products.forEach(item => {
                console.log(item);
                if(Number(item.id) === Number(newProducts.id)){
                    item.name = newProducts.name === undefined || newProducts.name === "" ? item.name : newProducts.name;
                    item.photo = newProducts.photo === undefined || newProducts.photo === "" ? item.photo : newProducts.photo;
                    item.price = newProducts.price === undefined || newProducts.price === "" ? item.price : newProducts.price;
                }
            })
        }
    });
    // Write the updated JSON back to the file
    await writeFileAsync(filepath, JSON.stringify(json));

    console.log(`Updated ${newProducts} products to shop ${shopId}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function updateShop(file, currentShop) {
    try {
      console.log(currentShop);
        // Read the JSON file
        const filepath = path.join(process.cwd(), '..', 'MenuDB', file);
        const data = await readFileAsync(filepath);
        let json = JSON.parse(data);
        const shopIndex = json.shops.findIndex(shop => shop.id === currentShop.id);
        if (shopIndex === -1) {
          throw new Error(`Shop with ID ${shopId} not found`);
        }
        const shops = json.shops;
        shops.forEach(shop => {
            if(Number(shop.id) === Number(currentShop.id)){
                shop.name = String(currentShop.name);
                console.log('Yep');
            }else{
              console.log('Nope');
            }
        })
        await writeFileAsync(filepath, JSON.stringify(json));

        console.log(`Updated new shop "${currentShop.name}" with ID ${currentShop.id}`);
        json = JSON.parse(await readFileAsync(filepath))
        console.log(json);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
  }

module.exports = {updateProductsToShop, updateShop};
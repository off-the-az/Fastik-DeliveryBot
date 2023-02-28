const shopList = [
    {
        id: 1,
        name: "Avrora Market",
        products: [
            {
                id: 1,
                name: "Іграшковий пістолет",
                photo: __dirname+"/assets/avrora/pistol.jpg",
                price: 150,
            },
            {
                id: 2,
                name: "Іграшкові роли філадельфія 10 шт",
                photo: __dirname+"/assets/avrora/sushi.jpg",
                price: 70,
            },

        ]
    },
    {
        id: 2,
        name: "Buty Flowers",
        products: [
            {
                id: 1,
                name: "Тюльпани фіолетові букет 30 шт",
                photo: __dirname+"/assets/buty_flowers/tulip.png",
                price: 1500,
            },
            {
                id: 2,
                name: "Тюльпани білі букет 30 шт",
                photo: __dirname+"/assets/buty_flowers/tulip.png",
                price: 1750,
            }
        ]
    }
]

module.exports = shopList;
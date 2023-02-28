const mongoose = require('mongoose');
require('dotenv').config()

async function dbconn() {
    mongoose.Promise = global.Promise;
    await mongoose.set('strictQuery', true);
    await mongoose.connect(`${process.env.MONGODB_URL}`, { useNewUrlParser: true }).then(()=>{
        console.log('MongoDB connection done')
    }).catch((err)=> console.log(`Error during connection: ${err}`));
}

module.exports = dbconn;
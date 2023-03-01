const crypto = require('crypto');

function md5(key){
    let algorithm = "md5";
    let result = crypto.createHash(algorithm).update(key).digest("base64");
    console.log(`${typeof result} for - ${result}`);
    return result;
}

module.exports = {
    md5,
}
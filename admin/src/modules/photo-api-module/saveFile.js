const { default: axios } = require('axios');
const fs = require('fs');

//const fileUrl = await ctx.telegram.getFileLink(photo.file_id);
//const filename = `${photo.file_unique_id}.jpg`;

async function downloadFile(url, filename) {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(filename));
    return new Promise((resolve, reject) => {
      response.data.on('end', resolve);
      response.data.on('error', reject);
    });
  }
  
async function readFile(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
}

async function deleteFile(filename) {
    return new Promise((resolve, reject) => {
      fs.unlink(filename, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
}

module.exports = {
    downloadFile,
    readFile,
    deleteFile
}
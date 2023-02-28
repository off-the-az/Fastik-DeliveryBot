'use strict'
const axios = require('axios');
const {md5} = require('../../modules');

class userController {
    async getByUsername(username){
        let data = null;
        try {
            await axios.get(`http://127.0.0.1:5000/api/user/get/byName/${username}`)
                .then((response) => {
                    data = response.data[0];
                })
                .catch((error) => {
                    console.log('Error while operating GET request for User.\nError: ' + error);
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at userController.\n Error info: ' + error);
            console.log('====================================');
        }
        return data;
    }

    async getById(id){
        let data = null;
        try {
            await axios.get(`http://127.0.0.1:5000/api/user/get/byId/${String(id)}`)
                .then((response) => {
                    data = response.data[0];
                })
                .catch((error) => {
                    console.log('Error while operating GET request for User.\nError: ' + error);
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at userController.\n Error info: ' + error);
            console.log('====================================');
        }
        return data;
    }

    async addUser(body){
        await axios.post('http://127.0.0.1:5000/api/user/add', body)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    async updateUser(username, body){
        let data = null;
        try {
            await axios.put(`http://127.0.0.1:5000/api/user/update/${username}`, body)
                .then((response) => {
                    data = response.data[0];
                })
                .catch((error) => {
                    console.log('====================================');
                    console.log('Error at userController.\n Error info: ' + error);
                    console.log('====================================');
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at userController.\n Error info: ' + error);
            console.log('====================================');
            data = null;
        }
        return data;
    }
    
    async deleteUserByName(username){
        await axios.delete(`http://127.0.0.1:5000/api/user/delete/byName/${username}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }
}

module.exports = userController;
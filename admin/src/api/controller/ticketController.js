'use strict'
const axios = require('axios');
const {md5} = require('../../modules/encryptionModule');

class ticketController {
    async getAllByStatus(status){
        let data = null;
        try {
            await axios.get(`http://127.0.0.1:5000/api/ticket/get/byStatus/${Number(status)}`)
                .then((response) => {
                    data = response.data;
                })
                .catch((error) => {
                    console.log('Error while operating GET request for User.\nError: ' + error);
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at ticketController.\n Error info: ' + error);
            console.log('====================================');
        }
        return data;
    }

    async getByUsername(username){
        let data = null;
        try {
            await axios.get(`http://127.0.0.1:5000/api/ticket/get/byName/${String(username)}`)
                .then((response) => {
                    console.log(`http://127.0.0.1:5000/api/ticket/get/byName/${String(username)}`);
                    data = response.data;
                })
                .catch((error) => {
                    console.log('Error while operating GET request for User.\nError: ' + error);
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at ticketController.\n Error info: ' + error);
            console.log('====================================');
        }
        return data;
    }

    async getById(id){
        let data = null;
        try {
            await axios.get(`http://127.0.0.1:5000/api/ticket/get/byId/${String(id)}`)
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
            console.log('Error at ticketController.\n Error info: ' + error);
            console.log('====================================');
        }
        return data;
    }

    async addTicket(body){
        await axios.post('http://127.0.0.1:5000/api/ticket/add', body)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    async updateTicket(id, body){
        let data = null;
        try {
            await axios.put(`http://127.0.0.1:5000/api/ticket/update/${id}`, body)
                .then((response) => {
                    data = response.data[0];
                })
                .catch((error) => {
                    console.log('====================================');
                    console.log('Error at ticketController.\n Error info: ' + error);
                    console.log('====================================');
                    data = null;
                }
            );
        } catch (error) {
            console.log('====================================');
            console.log('Error at ticketController.\n Error info: ' + error);
            console.log('====================================');
            data = null;
        }
        return data;
    }
}

module.exports = ticketController;
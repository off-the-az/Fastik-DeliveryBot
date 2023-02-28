'use strict'
const Service = require('../service/service');
const Model = require('../model/user.model');

class Controller {

    async readAll(){
        let service = new Service();
        return await service.read(Model, {});
    }

    async readBy(queue){
        let service = new Service();
        return await service.read(Model, queue);
    }

    async addUser(queue){
        let service = new Service();
        return await service.add(Model, queue);
    }

    async updateUser(queue, data){
        let service = new Service();
        return await service.update(Model, queue, data);
    }

    async deleteBy(queue){
        let service = new Service();
        return await service.delete(Model, queue);
    }
}

module.exports = Controller
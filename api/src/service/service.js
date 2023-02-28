'use strict'

class Service {

    async read(Model, queue){
        let row;
        await Model.find(queue).then((data) => {
            row = data;
        }).catch(err => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        });
        return row;
    }

    async add(Model, queue){
        let row;
        await Model(queue).save().then(() => {
            row = queue;
        }).catch(err => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        });
        return row;
    }

    async update(Model, queue, data){
        let row;
        await Model.updateOne(queue, data).then(() => {
            row = data;
        }).catch(err => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        });
        return row;
    }

    async delete(Model, queue){
        let row;
        await Model.deleteOne(queue).then(() => {
            row = queue;
        }).catch(err => {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        });
        return row;
    }
}

module.exports = Service
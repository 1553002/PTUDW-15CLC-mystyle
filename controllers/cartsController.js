var controller = {};

var models = require('../models');
var sequelize=require('sequelize');
controller.getAll = function (callback) {
    models.Cart.findAll({
        where:{
            delete : false
        }
    })
        .then(function (carts) {
            callback(carts);
        })
};

controller.getCartById = function (id, callback) {
    models.Cart.findOne({
        where: { id: id },
        include:
            {
                model: models.CartDetail
            }

    }).then(function (cart) {
        //console.log(cart);
        callback(cart);
    }).catch(function(error){
        //console.log("EROOR: ", error);
        callback(error);
    })
};

controller.createCart = function (Obj, callback) {
    models.Cart
        .create(Obj).then(function () {
            callback();
        }).catch((error) => {
            callback(error);
        });
};

controller.createCartDetail = function (Obj, callback) {
    models.CartDetail
        .create(Obj).then(function () {
            callback();
        }).catch((error) => {
            callback(error);
        })
}


controller.getSumbyDate = function (callback) {
    models.Cart.findAll({
        attributes: [[sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')),'date'],[sequelize.fn('sum',sequelize.col('total')),'sum']],
        group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')),'date'],
        where: {
            delete : false,
        },
        raw: true
    }).then(function (carts) {
        callback(carts);
    }).catch(function(err){
        callback(err);
    });
};


controller.updateStatusCart = function (id, callback) {
    models.Cart.update({delete : "true"}, {
        where: {
            id : id
        }
    }).then(function (cart) {
        callback(cart);
    }).catch(function(err){
        callback(err);
    })
};

module.exports = controller;
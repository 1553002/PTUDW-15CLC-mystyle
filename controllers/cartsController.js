var controller = {};

var models = require('../model');

controller.getAll = function(callback){
    models.Cart.findAll()
    .then(function(carts){
        callback(carts);
    })
};

controller.getAllCartById = function(id,callback){
    models.Cart
        .findOne({
            where: {
                id:id
            },
            include: [models.Cart]
        })
        .then(function(cart){
            callback(cart);
        });
};

module.exports = controller;
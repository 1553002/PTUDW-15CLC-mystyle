var controller = {};

var models = require('../models');

controller.getAll = function(callback){
    models.Cart.findAll()
    .then(function(carts){
        console.log(carts);
        callback(carts);
    })
};

controller.getCartById = function(id, callback){
    // models.Cart
    //     .findOne({
    //         where: {
    //             id:id
    //         },
    //         include: [models.CartDetail]
           
    //     })
    //     .then(function(cart){
    //         callback(cart);
    //     });

    models.Cart.find({
        where: {id: id},
        include: 
            {
                model: models.CartDetail
            }
        
    }).then(function(cart){
        console.log(cart);
        callback(cart);
    })
};



module.exports = controller;
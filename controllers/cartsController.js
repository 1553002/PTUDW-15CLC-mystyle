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
        callback(cart);
    })
};

controller.createCart = function (Obj, callback) {
    models.Cart
        .create(Obj).then(function () {
            callback();
        }).catch((error)=>{
            callback(error);
        });
};

controller.createCartDetail = function (Obj, callback){
    models.CartDetail
    .create(Obj).then(function (){
        callback();
    }).catch((error)=>{
        callback(error);
    })
}

module.exports = controller;
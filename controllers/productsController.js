'use strict';
var controller = {};
var sequelize = require('sequelize');

var models = require('../models');

controller.getAll = function (callback){
    models.Product.findAll(
        {
            include: [models.Category]
        }
    ).then(function(products){
        callback(products);
    });
}

controller.getProductDetailById = function (id, callback) {
    models.Product
    .findOne({
        //attributes: ['color','s','m','l','xl','ProductId'],
        where: {
            id : id
        },
        include: [models.Supplier]
        
    })
    .then(function (product) {
        callback(product);
    });

    // models.ProductDetail
    //     .findAll({
    //         attributes: ['color','s','m','l','xl','ProductId'],
    //         where: {
    //             ProductId : id
    //         },
    //         //include: [models.ProductDetail]
    //     })
    //     .then(function (product) {
    //         callback(product);
    //     });
};


<<<<<<< HEAD
controller.create = function(Obj, callback){
    models.Product.create(Obj).then(function(products){
        callback(products);
    })
}
=======
//1553025 - Xóa sản phẩm
controller.destroy = function (id, callback) {
    models.Product.destroy({
        where: {
            id: id
        }
    }).then(function (products) {
        callback(products);
    });
};
>>>>>>> dbdd672f60bcb490cdef8c22135118c0f8823542

module.exports = controller;
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
        where: {
            id : id
        },
        include: [models.Supplier, models.Category]
        
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



controller.create = function(Obj, callback){
    models.Product.create(Obj).then(function(products){
        callback(products);
    })
}

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

controller.update = function (id, Obj, callback) {
    console.log(Obj);
    models.Product.update(Obj, {
        where: {
            id: id
        }
    }).then(function (product) {
        callback(product);
    });
};


module.exports = controller;
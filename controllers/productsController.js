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
        include: [models.ProductDetail, models.Supplier]
        
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

module.exports = controller;
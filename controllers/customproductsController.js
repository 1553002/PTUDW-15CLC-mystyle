var controller = {};

var models = require('../models');


controller.getAll = function (email,callback) {
   
    models.CustomProduct
        .findAll(
            {
                where: {
                    account: email,
                    deleted:false

                }
               
            }
        )
        .then(function (customproducts) {
            callback(customproducts);
        })
};
controller.create = function (email,url,url1,callback) {
    console.log("HERRRRRRRRRR");
    models.CustomProduct
        .create({
            account:email,
            url: url,
            url1:url1,
            createdAt: new Date(),
            updatedAt: new Date(),
   
        }).then(function (customproducts) {
            callback(customproducts);
        });
};

controller.destroy = function (id, callback) {
    models.CustomProduct.destroy({
        where: {
            id: id
        }
    }).then(function (customproducts) {
        callback(customproducts);
    });
};

controller.updateDeleted = function (id,callback) {
    models.CustomProduct.update({
        deleted:true,
    }, {
        where: {
            id: id
        }
    }).then(function (customproducts) {
        callback(customproducts);
    });
};

module.exports = controller;
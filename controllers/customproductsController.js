var controller = {};

var models = require('../models');


controller.getAll = function (callback) {
    models.CustomProduct
        .findAll(
            {
                where: {
                    account: "nhan@gmail.com"
                }
               
            }
        )
        .then(function (customproducts) {
            callback(customproducts);
        })
};
controller.create = function (url,url1,url2, callback) {
    console.log("HERRRRRRRRRR");
    models.CustomProduct
        .create({
            account:"nhan@gmail.com",
            url: url,
            url1:url1,
            url2:url2,
            createdAt: new Date(),
            updatedAt: new Date(),
   
        }).then(function (customproducts) {
            callback(customproducts);
        });
};



module.exports = controller;
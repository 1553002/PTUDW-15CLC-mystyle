var controller = {};

var models = require('../models');
controller.create = function (imageULR, callback) {
    models.imageStorage
        .create({
            url: imageULR,
            createdAt: new Date(),
            updatedAt: new Date()
        }).then(function (imageULR) {
            callback(imageULR);
        });
};  

controller.getAll  = function (callback) {
    models.imageStorage
        .findAll()
        .then(function (imageULR) {
            callback(imageULR);
        })
};



module.exports = controller;
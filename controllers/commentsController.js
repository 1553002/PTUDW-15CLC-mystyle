var controller = {};

var models = require('../models');


controller.getAll = function (callback) {
    models.Comment
        .findAll()
        .then(function (comments) {
            callback(comments);
        })
};
controller.create = function (comment, callback) {
    models.Comment
        .create({
            comment: comment,
            createdAt: new Date(),
            updatedAt: new Date(),
   
        }).then(function (comments) {
            callback(comments);
        });
};



module.exports = controller;
var controller = {};

var models = require('../models');

controller.getAll = function (callback) {
    models.Category.findAll()
        .then(function (categories) {
            callback(categories);
        })
};

controller.getAllProductById = function (id, callback) {
    models.Category
        .findOne({
            where: {
                id : id
            },
            include: [models.Product]
        })
        .then(function (categorie) {
            callback(categorie);
        });
};
module.exports = controller;
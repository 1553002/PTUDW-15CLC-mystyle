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

controller.destroy = function (id, callback) {
    models.Category.destroy({
        where: {
            id: id
        }
    }).then(function (categories) {
        callback(categories);
    });
};

controller.create = function (categoryId, category, callback) {
    models.Category
        .create({
            id: categoryId,
            categoryName: category,
            createdAt: new Date(),
            updatedAt: new Date()

        }).then(function (categories) {
            callback(categories);
        });
};

module.exports = controller;
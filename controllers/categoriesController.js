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

controller.getAllCategoryWithProduct = function(callback){
    models.Category.findAll({
        include : {
            model : models.Product,
            limit : 4
        }
    }).then((cate)=>{
        callback(cate);
    }).catch((err)=>{
        callback(err);
    })
}

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

controller.update = function (old_id, new_id, category, callback) {
    models.Category.update({id : new_id, categoryName: category}, {
        where: {
            id : old_id
        }
    }).then(function (category) {
        callback(category);
    });
};


module.exports = controller;
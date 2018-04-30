var controller = {};

var db = require('../models');

controller.getAll = function (callback) {
    db.Supplier.findAll()
        .then(function (supplier) {
            callback(supplier);
        })
};


module.exports = controller;
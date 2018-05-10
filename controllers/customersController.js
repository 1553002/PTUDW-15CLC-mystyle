var controller = {};
var models = require('../models');
var bcrypt = require('bcryptjs');

controller.createUser = function (user, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            models.Customer
                .create(user)
                .then(function () {
                    callback(err);
                });
        });
    });
};

controller.getUserByEmail = function (email, callback) {
    models.Customer
        .findById(email)
        .then(function (user) {
            callback(false, user);
        })
        .catch(function (err) {
            callback(err, null);
        });
};

controller.comparePassword = function (password, hash, cb) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

controller.getAll = function (callback) {
    models.Customer.findAll()
        .then(function (customers) {
            callback(customers);
        })
};

controller.getAllUserByEmail = function (email, callback) {
    models.Customer
        .findOne({
            where: {
                email: email
            },
        })
        .then(function (customer) {
            callback(customer);
        });
};

controller.update = function (email, status, admin, callback) {
    models.Customer.update({active:status, isAdmin: admin}, {
        where: {
            email: email
        }
    }).then(function (customer) {
        callback(customer);
    });
};

controller.updateInfo = function (email, fullname,gender, callback) {
    models.Customer.update({
        fullname: fullname,
        gender:gender,
    }, {
        where: {
            email: email
        }
    }).then(function (customers) {
        callback(customers);
    });
};

controller.updateInfoWithPassword = function (email, fullname,gender,new_pass, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(new_pass, salt, function (err, hash) {
            new_pass = hash;

            models.Customer.update({
                    fullname: fullname,
                    gender:gender,
                    password:new_pass
                }, {
                    where: {
                        email: email
                    }
                }).then(function (customers) {
                    callback(customers);
                });
        });
    });
};
module.exports = controller;
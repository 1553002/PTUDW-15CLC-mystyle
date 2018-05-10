var controller = {};

var models = require('../models');


controller.getAll = function (callback) {
   
    models.CookieImage
        .findAll()
        .then(function (cookieimages) {
            callback(cookieimages);
        })
};
controller.create = function (id,url,callback) {
    console.log("Cookie is saved");
    models.CookieImage
        .create({
            id:id,
            url:url,
            createdAt: new Date(),
            updatedAt: new Date(),
   
        }).then(function (cookieimages) {
            callback(cookieimages);
        });
};

controller.getUrl= function (id, callback) {
   
    models.CookieImage
        .findOne(
            {
                where: {
                    id: id,
                 

                }
            }
        )
        
        .then(function (cookieimages) {
            callback(cookieimages);
        })
};

module.exports = controller;
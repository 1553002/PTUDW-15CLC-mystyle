var controller ={};
var models = require('../models');
var bcrypt = require('bcryptjs');

controller.createUser = function(user,callback){
    bcrypt.genSalt(10 , function(err,salt){
        bcrypt.hash(user.password, salt, function(err,hash){
            user.password = hash;
            models.Customer
            .create(user)
            .then(function(){
                callback(err);
            });
        });
    });
};

controller.getUserByEmail = function(email,callback){
    let Obj = {email : email}
    models.Customer
    .findOne({
        where: Obj
    })
    .then(function(user){
        callback(false,user);
    })
    .catch(function(err)
    {
        callback(err,null);   
    });
};

controller.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err,isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports = controller;
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
//var db        = {};

var database = process.env.DATABASE_URL || 'campeonatodb'
        var sequelize = ""

        if (process.env.DATABASE_URL) {
            sequelize = new Sequelize(database)
        }
        else {
            sequelize = new Sequelize(database, 'postgres', '', {
                dialect: 'postgres'
            });
        }

// if (config.use_env_variable) {
//   console.log("1");
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   console.log("2");
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

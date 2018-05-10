'use strict';
module.exports = (sequelize, DataTypes) => {
  var CookieImage = sequelize.define('CookieImage', {
    url: DataTypes.TEXT,
    cookie: DataTypes.TEXT
  }, {});
  CookieImage.associate = function(models) {
    // associations can be defined here
  };
  return CookieImage;
};
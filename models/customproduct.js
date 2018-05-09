'use strict';
module.exports = (sequelize, DataTypes) => {
  var CustomProduct = sequelize.define('CustomProduct', {
    account: DataTypes.TEXT,
    url: DataTypes.TEXT,
    url1: DataTypes.TEXT,
    url2: DataTypes.TEXT

  }, {});
  CustomProduct.associate = function(models) {
    // associations can be defined here
  };
  return CustomProduct;
};
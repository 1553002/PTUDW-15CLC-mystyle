'use strict';
module.exports = (sequelize, DataTypes) => {
  var CustomProduct = sequelize.define('CustomProduct', {
    account: DataTypes.TEXT,
    url: DataTypes.TEXT,
    url1: DataTypes.TEXT,
    deleted: DataTypes.BOOLEAN

  }, {});
  CustomProduct.associate = function(models) {
    // associations can be defined here
  };
  return CustomProduct;
};
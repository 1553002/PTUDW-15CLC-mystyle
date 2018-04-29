'use strict';
module.exports = (sequelize, DataTypes) => {
  var Delivery = sequelize.define('Delivery', {
    name: DataTypes.STRING,
    transportTime: DataTypes.STRING,
    fee: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  Delivery.associate = function(models) {
    Delivery.hasMany(models.Cart);
  };
  return Delivery;
};
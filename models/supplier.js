'use strict';
module.exports = (sequelize, DataTypes) => {
  var Supplier = sequelize.define('Supplier', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    companyName: DataTypes.STRING,
    madeIn: DataTypes.STRING,
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
  Supplier.associate = function(models) {
    // associations can be defined here
    Supplier.hasMany(models.Product);
  };
  return Supplier;
};
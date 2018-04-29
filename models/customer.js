'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    email: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    fullname: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    dateOB: DataTypes.DATE,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
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
  Customer.associate = function(models) {
    // associations can be defined here
    Customer.hasMany(models.Cart);
  };
  return Customer;
};
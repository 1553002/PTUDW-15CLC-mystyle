'use strict';
module.exports = (sequelize, DataTypes) => {
  var CartDetail = sequelize.define('CartDetail', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productName: DataTypes.STRING,
    size: DataTypes.STRING,
    image: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.STRING,
    total: DataTypes.STRING,
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
  CartDetail.associate = function (models) {
    CartDetail.belongsTo(models.Cart);
    //CartDetail.belongsTo(models.Product);
  };
  return CartDetail;
};
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
    image: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    delete: DataTypes.BOOLEAN,
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
'use strict';
module.exports = (sequelize, DataTypes) => {
  var CartDetail = sequelize.define('CartDetail', {
    size: DataTypes.STRING,
    image: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    discountPrice: DataTypes.STRING,
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
  CartDetail.associate = function(models) {
    //CartDetail.belongsTo(models.Cart);
    //CartDetail.belongsTo(models.Product);
  };
  return CartDetail;
};
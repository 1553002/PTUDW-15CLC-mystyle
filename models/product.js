'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: sequelize.literal('random_string(5)')
    },
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    productPrice: DataTypes.INTEGER,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    image3: DataTypes.STRING,
    image4: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    discountPrice: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    discountAvailable: DataTypes.BOOLEAN,
    saleoffExpDate: DataTypes.DATE,
    s: DataTypes.INTEGER,
    m: DataTypes.INTEGER,
    l: DataTypes.INTEGER,
    xl: DataTypes.INTEGER,
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
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Supplier);
    Product.belongsTo(models.Category);
    //Product.hasOne(models.CartDetail);
    Product.belongsToMany(models.Cart, {
      through: models.CartDetail,
      foreignKey: 'productId'
    });
  };
  return Product;
};
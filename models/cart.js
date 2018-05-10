'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cart = sequelize.define('Cart', {
    id:{
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: sequelize.literal('random_string(10)'),
      primaryKey: true
      // type: DataTypes.UUID,
      // primaryKey: true,
      // defaultValue: DataTypes.UUIDV4,
      // allowNull: false
    },
    receiver: DataTypes.STRING,
    paymentType: {
      type: DataTypes.ENUM,
      values: ['Thanh toán khi nhận hàng', 'Thẻ nội địa', 'Thẻ quốc tế']
    },
    deliveryDate: DataTypes.DATE,
    transactStatus: {
      type: DataTypes.ENUM,
      values: ['Xử lý','Đóng gói','Vận chuyển','Giao hàng thành công','Hủy']
    },
    receiveAddress: DataTypes.STRING,
    total: DataTypes.INTEGER,
    delete : DataTypes.BOOLEAN,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()::date')
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  Cart.associate = function(models) {
    Cart.belongsTo(models.Customer);
    Cart.hasMany(models.CartDetail);
    // Cart.belongsToMany(models.Product, {
    //   through: {
    //     model: models.CartDetail
    //   },
    //   foreignKey: 'cartId',
    //   as: 'ProductDetail'
    // });
  };
  return Cart;
};
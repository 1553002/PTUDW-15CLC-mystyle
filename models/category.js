'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    categoryName: DataTypes.STRING,
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
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.Product);
  };
  return Category;
};
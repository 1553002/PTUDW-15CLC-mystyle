'use strict';
module.exports = (sequelize, DataTypes) => {
  var imageStorage = sequelize.define('imageStorage', {
    url: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    delete : DataTypes.BOOLEAN,
    ofuser : DataTypes.BOOLEAN,
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
  imageStorage.associate = function(models) {
    // associations can be defined here
  };
  return imageStorage;
};
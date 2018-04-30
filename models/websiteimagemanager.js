'use strict';
module.exports = (sequelize, DataTypes) => {
  var WebsiteImageManager = sequelize.define('WebsiteImageManager', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  WebsiteImageManager.associate = function(models) {
    // associations can be defined here
  };
  return WebsiteImageManager;
};
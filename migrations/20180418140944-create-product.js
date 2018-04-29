'use strict';
let sequelize = require('sequelize');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      ProductName: {
        type: Sequelize.STRING
      },
      ProductPrice: {
        type: Sequelize.INTEGER
      },
      ProductImage1: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ProductImage2:{
        allowNull: true,
        type: Sequelize.STRING
      },
      ProductImage3: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ProductImage4: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ProductUnit: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ProductProductStock: {
        type: Sequelize.INTEGER
      },
      ProductAvailable: {
        type: Sequelize.BOOLEAN
      },
      ProductDiscount: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      ProductDiscountAvailable: {
        type: Sequelize.BOOLEAN
      },
      ProductNote: {
        allowNull: true,
        type: Sequelize.TEXT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};
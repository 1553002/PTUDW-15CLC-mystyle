'use strict';
let sequelize = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProductDetails', {
      color: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProductDetails');
  }
};
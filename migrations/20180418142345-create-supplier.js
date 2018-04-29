'use strict';
let sequelize = require('sequelize');

module.exports = {
  
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      CompanyName: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Suppliers');
  }
};
'use strict';
const { Sequelize} =require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Option","questionId",{
      type:Sequelize.DataTypes.INTEGER,
      onDelete:"CASCADE",
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Option",{
      fields:["questionId"],
      type:"foreign key",
      onDelete:"CASCADE",
      references:{
        table:"Question",
        field:"id",
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Option","questionId")
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

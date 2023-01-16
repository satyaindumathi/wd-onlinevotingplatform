'use strict';
const { Sequelize} =require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Options","questionId",{
      type:Sequelize.DataTypes.INTEGER,
      onDelete:"CASCADE",
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Options",{
      fields:["questionId"],
      type:"foreign key",
      onDelete:"CASCADE",
      references:{
        table:"Questions",
        field:"id",
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Options","questionId")
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

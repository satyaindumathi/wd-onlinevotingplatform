'use strict';
const {Sequelize} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Question","electionId",{
      type:Sequelize.DataTypes.INTEGER,
    });
    await queryInterface.addConstraint("Question",{
      fields:["electionId"],
      type:"foreign key",
      references:{
        table:"Election",
        field:"id",
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Question","electionId");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

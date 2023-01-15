'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Voter","electionId",{
      type:Sequelize.DataTypes.INTEGER,
    })
    await queryInterface.addConstraint("Voter",{
      fields:["electionId"],
      type:"foreign key",
      references:{
        table:"Election",
        field:"id"
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Voter","electionId")
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

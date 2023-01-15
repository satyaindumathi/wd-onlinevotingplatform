'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voter.belongsTo(models.Election,{
        foreignKey:"electionId"
      })
    }
    static async countOFVoters(electionId) {
      return await this.count({
        where:{
          electionId
        }
      })
    }
  }
  Voter.init({
    voterUserId:{
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
    },
    voterPassword:{
      type: DataTypes.STRING,
      allowNull:false
    },
    IsVoted: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false,
    },
    IsWho:{
      type: DataTypes.STRING,
      defaultValue:"Voter"
    }
  }, 
  {
    sequelize,
    modelName: 'Voter',
  });
  return Voter;
};
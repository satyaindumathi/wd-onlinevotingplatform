'use strict';
const 
{
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) =>
 {
  class Election extends Model
   {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models)
     {
      // define association here
      Election.belongsTo(models.Admin,
        {
        foreignKey:"AdminId",
      });
    }
  static addElection({ElectionName,AdminId,CustomURL }) 
  {
    return this.create
    ({
      ElectionName,
      CustomURL,
      AdminId,
    });
  }
static getAllElections(AdminId) 
{
  return this.findAll
   ({
    where:
     {
      AdminId,
    },
    order:[["id","ASC"]],
  });
}
static getElectionWithId(id) 
{
  return this.findOne
   ({
    where:
     {
      id,
    },
    order:[["id","ASC"]],
  });
}
   }

  Election.init
  ({
    ElectiontName: DataTypes.STRING,
    CustomURL: DataTypes.STRING,
    IsRunning: DataTypes.BOOLEAN,
    IsEnded: DataTypes.BOOLEAN
  }, 
  {
    sequelize,
    modelName: 'Election',
  });
  return Election;
};
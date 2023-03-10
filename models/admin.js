'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.hasMany(models.Election,{
        foreignKey:"AdminId"
      })
    }
  }
  Admin.init({
    FirstName:{
      type:DataTypes.STRING,
      allowNull: false
    },
   LastName:{
    type: DataTypes.STRING,
    allowNull:false
   },
    Email:DataTypes.STRING,
    Password :{
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull:true,
        len:10
      }
    }
  },{
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};
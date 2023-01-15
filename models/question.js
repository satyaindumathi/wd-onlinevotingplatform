'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Election,{
        foreignkey: "electionId",
      });
      Question.hasMany(models.Option,{
        foreignkey:"questionId"
      })
    }
    static addNewQuestion({question,description,electionId}) {
      return this.create({
        ElectionQuestion:question,
        QuestionDescription:description,
        electionId
      })
    }
    static async countOFQuestions(electionId) {
      return await this.count({
        where: {
          electionId
        }
      })
    }
    static getQuestionWithId(id) {
      return this.findOne({
        where: {
          id,
        },
      });
    }
  }
  Question.init({
    ElectionQuestion: {
      type:DataTypes.STRING,
      allowNull:false
    },
    QuestionDescription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.exercise.belongsToMany(models.user, {through: 'userExercises'})
      models.exercise.belongsToMany(models.workout, {through: 'workoutExercises'})
    }
  };
  exercise.init({
    name: DataTypes.STRING,
    bodyPart: DataTypes.STRING,
    equipment: DataTypes.STRING,
    muscleTargeted: DataTypes.STRING,
    exerciseDemo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'exercise',
  });
  return exercise;
};
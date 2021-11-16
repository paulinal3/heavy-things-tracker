'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workoutExercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  workoutExercise.init({
    workoutId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'workoutExercise',
  });
  return workoutExercise;
};
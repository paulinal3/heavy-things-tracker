'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.workout.belongsTo(models.user)
      models.workout.belongsToMany(models.exercise, {through: 'workoutExercises'})
    }
  };
  workout.init({
    date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    type: DataTypes.STRING,
    comments: DataTypes.TEXT,
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    scheduledDate: DataTypes.DATEONLY,
    img: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'workout',
  });
  return workout;
};
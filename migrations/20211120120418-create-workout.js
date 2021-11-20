'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      duration: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.TEXT
      },
      completed: {
        type: Sequelize.BOOLEAN
      },
      scheduledDate: {
        type: Sequelize.DATEONLY
      },
      img: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('workouts');
  }
};
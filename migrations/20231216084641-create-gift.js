'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gifts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // 'Movies' would also work
          key: 'id'
        } 
      },
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      voucherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Vouchers', // 'Movies' would also work
          key: 'id'
        }
      },
      receiverId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // 'Movies' would also work
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Unclaimed'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Gifts');
  }
};
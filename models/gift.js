'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gift.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
      Gift.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });
      Gift.belongsTo(models.Voucher, { foreignKey: 'voucherId' })
    }
  }
  Gift.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "Message Required"
        },
        notNull: {
          msg : "Message Required"
        }
      }
    },
    senderId: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    voucherId: {
      type: DataTypes.INTEGER
    },
    receiverId: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Unclaimed'
    }
  }, {
    sequelize,
    modelName: 'Gift',
  });

  return Gift;
};
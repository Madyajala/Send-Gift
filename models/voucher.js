'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.hasMany(models.Gift, { foreignKey: 'voucherId' })
    }
  }
  Voucher.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "Title Required"
        },
        notNull: {
          msg : "Title Required"
        }
      }
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "Tag Required"
        },
        notNull: {
          msg : "Tag Required"
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "imageUrl Required"
        },
        notNull: {
          msg : "imageUrl Required"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};
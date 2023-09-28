"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      country: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      lat: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      lng: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};

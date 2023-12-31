"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  SpotImage.init(
    {
      spotId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      url: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      preview: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "SpotImage",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return SpotImage;
};

"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: { model: "Users" },
          onDelete: "CASCADE",
        },
        address: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        state: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        country: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        lat: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        lng: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING(256),
        },
        price: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  },
};

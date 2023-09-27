"use strict";
/** @type {import('sequelize-cli').Migration} */

const { Spot, SpotImage, User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spots = [
  {
    username: "FakeUser1",
    address: "1004 Eddy St",
    city: "Lake Tahoe",
    state: "CA",
    country: "USA",
    lat: 120.5686,
    lng: 80.4566,
    name: "Lakeside Cabin",
    description: "Beautiful lake view from a cozy cabin",
    price: 320.65,
    images: [
      { url: "https://sposts/spot-1.png", preview: false },
      { url: "https://spots/spot-2.png", preview: true },
    ],
  },
  {
    username: "FakeUser2",
    address: "342 Fillmore St",
    city: "Las Vegas",
    state: "NV",
    country: "USA",
    lat: 33.5686,
    lng: 180.46,
    name: "Condo in Las Vegas",
    description:
      "Enjoy a stylish experience at this centrally-located place with a strip view. ",
    price: 220.65,
    images: [{ url: "https://spots/spot-3.png", preview: true }],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let spot of spots) {
      const { username, images, ...spotDetails } = spot;
      const user = await User.findOne({ where: { username } });

      const newSpot = await Spot.create({ ownerId: user.id, ...spotDetails });

      for (let image of images) {
        SpotImage.create({ spotId: newSpot.id, ...image });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    for (let spot of spots) {
      const { username, images, ...spotDetails } = spot;
      const user = await User.findOne({ where: { username } });

      const deletedSpot = await Spot.destroy({
        where: { ownerId: user.id, ...spotDetails },
      });

      for (let image of images) {
        SpotImage.destroy({ where: { spotId: deletedSpot.id, ...image } });
      }
    }
  },
};

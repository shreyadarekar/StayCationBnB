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
    lat: 80.66,
    lng: 120.34,
    name: "Lakeside Cabin",
    description: "Beautiful lake view from a cozy cabin",
    price: 320.65,
    images: [
      {
        url: "https://a0.muscache.com/im/pictures/01a70000-02c6-425d-be9b-120a4cf9b2c0.jpg?im_w=720",
        preview: false,
      },
      {
        url: "https://a0.muscache.com/im/pictures/958c7ab9-e224-4a93-ad30-8b6c72304323.jpg?im_w=720",
        preview: true,
      },
    ],
  },
  {
    username: "FakeUser2",
    address: "342 Fillmore St",
    city: "Las Vegas",
    state: "NV",
    country: "USA",
    lat: 33.56,
    lng: 170.46,
    name: "Condo in Las Vegas",
    description:
      "Enjoy a stylish experience at this centrally-located place with a strip view. ",
    price: 220.65,
    images: [
      {
        url: "https://a0.muscache.com/im/pictures/hosting/Hosting-986943984454608614/original/8055947b-c38e-45b5-9584-709dcfd2312a.jpeg?im_w=720",
        preview: true,
      },
    ],
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

      await Spot.destroy({ where: { ownerId: user.id, ...spotDetails } });
    }
  },
};

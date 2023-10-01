"use strict";
/** @type {import('sequelize-cli').Migration} */

const { Spot, Review, User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const reviews = [
  {
    username: "FakeUser1",
    spotName: "Lakeside Cabin",
    review: "Nice place",
    stars: 4.7,
  },
  {
    username: "FakeUser2",
    spotName: "Lakeside Cabin",
    review: "Nice",
    stars: 4,
  },
  {
    username: "Demo-lition",
    spotName: "Lakeside Cabin",
    review: "cool place",
    stars: 4.5,
  },
  {
    username: "Demo-lition",
    spotName: "Condo in Las Vegas",
    review: "cool",
    stars: 4.5,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let rev of reviews) {
      const { username, spotName, review, stars } = rev;
      const user = await User.findOne({ where: { username } });
      const spot = await Spot.findOne({ where: { name: spotName } });

      const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (let rev of reviews) {
      const { username, spotName, review, stars } = rev;
      const user = await User.findOne({ where: { username } });
      const spot = await Spot.findOne({ where: { name: spotName } });

      await Review.destroy({
        where: {
          userId: user.id,
          spotId: spot.id,
          review,
          stars,
        },
      });
    }
  },
};

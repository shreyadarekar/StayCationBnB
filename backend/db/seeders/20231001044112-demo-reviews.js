"use strict";
/** @type {import('sequelize-cli').Migration} */

const { Spot, Review, ReviewImage, User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const reviews = [
  {
    username: "FakeUser1",
    spotName: "Lakeside Cabin",
    review: "Nice place",
    stars: 3,
    images: [
      { url: "https://sposts/spot-1/review-1.png" },
      { url: "https://sposts/spot-1/review-2.png" },
    ],
  },
  {
    username: "FakeUser2",
    spotName: "Lakeside Cabin",
    review: "Nice",
    stars: 4,
    images: [{ url: "https://sposts/spot-1/review-3.png" }],
  },
  {
    username: "Demo-lition",
    spotName: "Lakeside Cabin",
    review: "cool place",
    stars: 3,
    images: [
      { url: "https://sposts/spot-1/review-4.png" },
      { url: "https://sposts/spot-1/review-5.png" },
      { url: "https://sposts/spot-1/review-6.png" },
    ],
  },
  {
    username: "Demo-lition",
    spotName: "Condo in Las Vegas",
    review: "cool",
    stars: 4,
    images: [
      { url: "https://sposts/spot-1/review-7.png" },
      { url: "https://sposts/spot-1/review-8.png" },
    ],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let rev of reviews) {
      const { username, spotName, review, stars, images } = rev;
      const user = await User.findOne({ where: { username } });
      const spot = await Spot.findOne({ where: { name: spotName } });

      const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars,
      });

      for (let image of images) {
        ReviewImage.create({ reviewId: newReview.id, ...image });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    for (let rev of reviews) {
      const { username, spotName, review, stars, images } = rev;
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

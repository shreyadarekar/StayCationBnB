"use strict";
/** @type {import('sequelize-cli').Migration} */

const { Spot, Booking, User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const bookings = [
  {
    username: "FakeUser1",
    spotName: "Lakeside Cabin",
    startDate: "2021-11-19",
    endDate: "2021-11-20",
  },
  {
    username: "Demo-lition",
    spotName: "Lakeside Cabin",
    startDate: "2022-11-19",
    endDate: "2022-11-20",
  },
  {
    username: "Demo-lition",
    spotName: "Condo in Las Vegas",
    startDate: "2021-1-19",
    endDate: "2021-1-20",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let bkg of bookings) {
      const { username, spotName, startDate, endDate } = bkg;
      const user = await User.findOne({ where: { username } });
      const spot = await Spot.findOne({ where: { name: spotName } });

      const newBooking = await Booking.create({
        userId: user.id,
        spotId: spot.id,
        startDate,
        endDate,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (let bkg of bookings) {
      const { username, spotName, startDate, endDate } = bkg;
      const user = await User.findOne({ where: { username } });
      const spot = await Spot.findOne({ where: { name: spotName } });

      await Booking.destroy({
        userId: user.id,
        spotId: spot.id,
        startDate,
        endDate,
      });
    }
  },
};

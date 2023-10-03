const express = require("express");
const {
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  User,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const Op = require("sequelize").Op;

const router = express.Router();

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Start date is required"),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date is required"),
  check("endDate").toDate(),
  check("startDate")
    .toDate()
    .custom((startDate, { req }) => {
      if (startDate.getTime() >= req.body.endDate.getTime()) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const allBookings = await Booking.findAll({
    where: { userId: user.id },
    include: {
      model: Spot,
      attributes: { exclude: ["description", "createdAt", "updatedAt"] },
      include: {
        model: SpotImage,
        where: { preview: true },
        attributes: ["url"],
      },
    },
  });

  const formattedBookings = allBookings.reduce((acc, booking) => {
    const { id, spotId, Spot, ...bookingDetails } = booking.toJSON();
    const { SpotImages, ...spotDetails } = Spot;

    const formattedSpot = { ...spotDetails, previewImage: "" };
    // set previewImage
    if (SpotImages.length) formattedSpot.previewImage = SpotImages[0].url;

    const formattedBooking = {
      id,
      spotId,
      Spot: formattedSpot,
      ...bookingDetails,
    };
    acc.push(formattedBooking);
    return acc;
  }, []);

  res.json({ Bookings: formattedBookings });
});

// Edit a Booking
router.put(
  "/:bookingId",
  [requireAuth, ...validateBooking],
  async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== user.id) {
      return res
        .status(404)
        .json({ message: "Booking must belong to the current user" });
    }

    const currentDate = new Date();
    if (Date.parse(endDate) <= currentDate) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    const existingBookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
        [Op.or]: {
          startDate: { [Op.between]: [startDate, endDate] },
          endDate: { [Op.between]: [startDate, endDate] },
        },
      },
    });

    // console.log("existingBookings", existingBookings);
    // ToDo: startDate and endDate between existing booking
    if (existingBookings.length) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const updatedBooking = await booking.update({
      startDate,
      endDate,
    });

    res.json(updatedBooking);
  }
);

module.exports = router;

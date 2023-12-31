const express = require("express");
const { Spot, SpotImage, Booking } = require("../../db/models");
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
        throw new Error("endDate cannot come before startDate");
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
  async (req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.title = "Couldn't find a Booking with the specified id";
      err.errors = { message: "Booking couldn't be found" };
      err.status = 404;
      return next(err);
    }

    if (booking.userId !== user.id) {
      const err = new Error("Forbidden");
      err.title = "Require proper authorization";
      err.errors = { message: "Forbidden" };
      err.status = 403;
      return next(err);
    }

    const currentDate = new Date();
    if (Date.parse(endDate) <= currentDate) {
      const err = new Error("Past bookings can't be modified");
      err.title = "Can't edit a booking that's past the end date";
      err.errors = { message: "Past bookings can't be modified" };
      err.status = 403;
      return next(err);
    }

    const allBookings = await Booking.findAll({
      where: { spotId: booking.spotId, id: { [Op.ne]: booking.id } },
    });
    for (let bkg of allBookings) {
      const errors = {};

      const { startDate: bkgStartDate, endDate: bkgEndDate } = bkg.toJSON();
      const existingStartDate = new Date(bkgStartDate);
      const existingEndDate = new Date(bkgEndDate);
      const inputStartDate = new Date(startDate);
      const inputEndDate = new Date(endDate);

      if (
        (inputStartDate >= existingStartDate &&
          inputStartDate <= existingEndDate) ||
        (inputStartDate < existingStartDate &&
          inputEndDate > existingEndDate &&
          existingStartDate >= inputStartDate &&
          existingStartDate <= inputEndDate)
      ) {
        errors.startDate = "Start date conflicts with an existing booking";
      }
      if (
        (inputEndDate >= existingStartDate &&
          inputEndDate <= existingEndDate) ||
        (inputStartDate < existingStartDate &&
          inputEndDate > existingEndDate &&
          existingEndDate >= inputStartDate &&
          existingEndDate <= inputEndDate)
      ) {
        errors.endDate = "End date conflicts with an existing booking";
      }

      if (errors.startDate || errors.endDate) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.title = "Booking conflict";
        err.errors = errors;
        err.status = 403;
        return next(err);
      }
    }

    const updatedBooking = await booking.update({
      startDate,
      endDate,
    });

    res.json(updatedBooking);
  }
);

// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.title = "Couldn't find a Booking with the specified id";
    err.errors = { message: "Booking couldn't be found" };
    err.status = 404;
    return next(err);
  }

  if (booking.userId !== user.id) {
    const err = new Error("Forbidden");
    err.title = "Require proper authorization";
    err.errors = { message: "Forbidden" };
    err.status = 403;
    return next(err);
  }

  const currentDate = new Date();
  if (Date.parse(booking.startDate) <= currentDate) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.title = "Bookings that have been started can't be deleted";
    err.errors = {
      message: "Bookings that have been started can't be deleted",
    };
    err.status = 403;
    return next(err);
  }

  await booking.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

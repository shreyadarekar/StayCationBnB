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

const validateQueryParams = [
  check("page")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 10 })
    .default(1)
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 20 })
    .default(20)
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

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

// Get all spots
router.get("/", validateQueryParams, async (req, res) => {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  const allSpots = await Spot.findAll({
    where,
    include: [
      {
        model: SpotImage,
        where: { preview: true },
        attributes: ["url"],
      },
      {
        model: Review,
        attributes: ["stars"],
      },
    ],
    limit: size,
    offset: size * (page - 1),
  });

  const formattedSpots = allSpots.reduce((acc, spot) => {
    const { Reviews, SpotImages, ...spotDetails } = spot.toJSON();
    const formattedSpot = { ...spotDetails, avgRating: 0, previewImage: "" };

    // set avgRating
    if (Reviews.length) {
      const sumStars = Reviews.reduce((sum, rev) => sum + rev.stars, 0);
      formattedSpot.avgRating = Number((sumStars / Reviews.length).toFixed(1));
    }

    // set previewImage
    if (SpotImages.length) formattedSpot.previewImage = SpotImages[0].url;

    acc.push(formattedSpot);
    return acc;
  }, []);

  res.json({ Spots: formattedSpots, page, size });
});

// Create a spot
router.post("/", [requireAuth, ...validateSpot], async (req, res) => {
  const { user } = req;
  const spotDetails = req.body;

  const newSpot = await Spot.create({ ownerId: user.id, ...spotDetails });

  res.status(201).json(newSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { url, preview } = req.body;
  const isPreview = preview || false;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res
      .status(404)
      .json({ message: "Spot must belong to the current user" });
  }

  const newSpotImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview: isPreview,
  });

  res.json({
    id: newSpotImage.id,
    url: newSpotImage.url,
    preview: newSpotImage.preview,
  });
});

// Get all spots for current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const allSpots = await Spot.findAll({
    where: { ownerId: user.id },
    include: [
      {
        model: SpotImage,
        where: { preview: true },
        attributes: ["url"],
      },
      {
        model: Review,
        attributes: ["stars"],
      },
    ],
  });

  const formattedSpots = allSpots.reduce((acc, spot) => {
    const { Reviews, SpotImages, ...spotDetails } = spot.toJSON();
    const formattedSpot = { ...spotDetails, avgRating: 0, previewImage: "" };

    // set avgRating
    if (Reviews.length) {
      const sumStars = Reviews.reduce((sum, rev) => sum + rev.stars, 0);
      formattedSpot.avgRating = Number((sumStars / Reviews.length).toFixed(1));
    }

    // set previewImage
    if (SpotImages.length) formattedSpot.previewImage = SpotImages[0].url;

    acc.push(formattedSpot);
    return acc;
  }, []);

  res.json({ Spots: formattedSpots });
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  let allBookings = [];
  if (spot.ownerId !== user.id) {
    allBookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
  } else {
    allBookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: { model: User, attributes: ["id", "firstName", "lastName"] },
    });

    allBookings = allBookings.reduce((acc, bkg) => {
      const { User, ...bookingDetails } = bkg.toJSON();
      acc.push({ User, ...bookingDetails });
      return acc;
    }, []);
  }

  res.json({ Bookings: allBookings });
});

// Create a Booking from a Spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  [requireAuth, ...validateBooking],
  async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === user.id) {
      return res
        .status(404)
        .json({ message: "Spot must NOT belong to the current user" });
    }

    const existingStartDateBookings = await Booking.findAll({
      where: {
        spotId: spot.id,
        startDate: { [Op.between]: [startDate, endDate] },
      },
    });
    const existingEndDateBookings = await Booking.findAll({
      where: {
        spotId: spot.id,
        endDate: { [Op.between]: [startDate, endDate] },
      },
    });
    // ToDo: startDate and endDate between existing booking
    if (existingStartDateBookings.length || existingEndDateBookings.length) {
      const errors = {};
      if (existingStartDateBookings.length) {
        errors.startDate = "Start date conflicts with an existing booking";
      }
      if (existingEndDateBookings.length) {
        errors.endDate = "End date conflicts with an existing booking";
      }

      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors,
      });
    }

    const newBooking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate,
      endDate,
    });

    res.json(newBooking);
  }
);

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.json({ Reviews: reviews });
});

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  [requireAuth, ...validateReview],
  async (req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const review = await Review.findOne({
      where: { userId: user.id, spotId: req.params.spotId },
    });
    if (review) {
      return res
        .status(500)
        .json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
      userId: user.id,
      spotId: req.params.spotId,
      ...req.body,
    });

    res.status(201).json(newReview);
  }
);

// Get details of a spot from an id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: Review,
        attributes: ["stars"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const { Reviews, User: Owner, ...spotDetails } = spot.toJSON();
  const formattedSpot = {
    ...spotDetails,
    numReviews: Reviews.length,
    avgStarRating: 0,
  };

  // set avgStarRating
  if (Reviews.length) {
    const sumStars = Reviews.reduce((sum, rev) => sum + rev.stars, 0);
    formattedSpot.avgStarRating = Number(
      (sumStars / Reviews.length).toFixed(1)
    );
  }

  // set Owner
  formattedSpot.Owner = Owner;

  res.json(formattedSpot);
});

// Edit a Spot
router.put("/:spotId", [requireAuth, ...validateSpot], async (req, res) => {
  const { user } = req;
  const spotDetails = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res
      .status(404)
      .json({ message: "Spot must belong to the current user" });
  }

  const newSpot = await spot.update(spotDetails);

  res.json(newSpot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res
      .status(404)
      .json({ message: "Spot must belong to the current user" });
  }

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

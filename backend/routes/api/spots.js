const express = require("express");
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  // ToDo: Custom validation error message not working with `isLength` function
  check("lat")
    .exists({ checkFalsy: true })
    .isLength({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isLength({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

// Get all spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll({
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
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    res.status(404).json({ message: "Spot must belong to the current user" });
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
    res.status(404);
    return res.json({ message: "Spot couldn't be found" });
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
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    res.status(404).json({ message: "Spot must belong to the current user" });
  }

  const newSpot = await spot.update(spotDetails);

  res.json(newSpot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    res.status(404).json({ message: "Spot must belong to the current user" });
  }

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

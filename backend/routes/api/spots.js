const express = require("express");
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

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
router.get("/:spotId", async (req, res, next) => {
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

module.exports = router;

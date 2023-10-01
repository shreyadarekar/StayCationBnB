const express = require("express");
const { Spot, SpotImage, Review } = require("../../db/models");
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

  res.json(formattedSpots);
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

  res.json(formattedSpots);
});

module.exports = router;

const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all spots
router.get("/", async (req, res) => {
  // ToDo: Add `avgRating` to every spot
  const allSpots = await Spot.findAll({
    include: {
      model: SpotImage,
      where: { preview: true },
      attributes: [["url", "previewImage"]],
    },
  });

  const formattedSpots = allSpots.reduce((acc, spot) => {
    const { SpotImages, ...spotDetails } = spot.toJSON();
    const formattedSpot = { ...spotDetails, previewImage: "" };
    if (SpotImages.length)
      formattedSpot.previewImage = SpotImages[0].previewImage;

    acc.push(formattedSpot);
    return acc;
  }, []);

  res.json(formattedSpots);
});

// Get all spots for current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  // ToDo: Add `avgRating` to every spot
  const allSpots = await Spot.findAll({
    where: { ownerId: user.id },
    include: {
      model: SpotImage,
      where: { preview: true },
      attributes: [["url", "previewImage"]],
    },
  });

  const formattedSpots = allSpots.reduce((acc, spot) => {
    const { SpotImages, ...spotDetails } = spot.toJSON();
    const formattedSpot = { ...spotDetails, previewImage: "" };
    if (SpotImages.length)
      formattedSpot.previewImage = SpotImages[0].previewImage;

    acc.push(formattedSpot);
    return acc;
  }, []);

  res.json(formattedSpots);
});

module.exports = router;

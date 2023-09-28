const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all spots
router.get("/", async (req, res) => {
  // const allSpots = await Spot.findAll({
  //   include: {
  //     model: SpotImage,
  //     where: { preview: true },
  //     attributes: ["url"],
  //   },
  // });

  const allSpots = await Spot.findAll();

  for (let spot of allSpots) {
    const spotImage = await spot.getSpotImages({
      where: { preview: true },
    });

    // ToDo: Add `previewImage` and `avgRating` to every spot
    const spotPreviewImage = spotImage ? spotImage.url : "";
    spot.previewImage = spotPreviewImage;
  }

  res.json(allSpots);
});

// Get all spots for current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const allSpots = await Spot.findAll({ where: { ownerId: user.id } });

  for (let spot of allSpots) {
    const spotImage = await spot.getSpotImages({
      where: { preview: true },
    });

    // ToDo: Add `previewImage` and `avgRating` to every spot
    const spotPreviewImage = spotImage ? spotImage.url : "";
    spot.previewImage = spotPreviewImage;
  }

  res.json(allSpots);
});

module.exports = router;

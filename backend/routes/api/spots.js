const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all spots
router.get("/", async (req, res) => {
  // ToDo: Add `previewImage` and `avgRating` to every spot
  const allSpots = await Spot.findAll({
    include: {
      model: SpotImage,
      where: { preview: true },
      attributes: [["url", "previewImage"]],
    },
  });

  res.json(allSpots);
});

// Get all spots for current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  // ToDo: Add `previewImage` and `avgRating` to every spot
  const allSpots = await Spot.findAll({
    where: { ownerId: user.id },
    include: {
      model: SpotImage,
      where: { preview: true },
      attributes: [["url", "previewImage"]],
    },
  });

  res.json(allSpots);
});

module.exports = router;

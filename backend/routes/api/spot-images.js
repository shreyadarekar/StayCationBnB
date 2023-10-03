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

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const spotImage = await SpotImage.findByPk(req.params.imageId, {
    include: Spot,
  });

  if (!spotImage) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  if (spotImage.Spot.ownerId !== user.id) {
    return res
      .status(404)
      .json({ message: "Spot must belong to the current user" });
  }

  await spotImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

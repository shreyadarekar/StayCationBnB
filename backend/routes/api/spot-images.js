const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotImage = await SpotImage.findByPk(req.params.imageId, {
    include: Spot,
  });

  if (!spotImage) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  if (spotImage.Spot.ownerId !== user.id) {
    const err = new Error("Forbidden");
    err.title = "Require proper authorization";
    err.errors = { message: "Forbidden" };
    err.status = 403;
    return next(err);
  }

  await spotImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

const express = require("express");
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
    include: Review,
  });

  if (!reviewImage) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  if (reviewImage.Review.userId !== user.id) {
    return res
      .status(404)
      .json({ message: "Review must belong to the current user" });
  }

  await reviewImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

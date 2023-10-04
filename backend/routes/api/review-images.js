const express = require("express");
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
    include: Review,
  });

  if (!reviewImage) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  if (reviewImage.Review.userId !== user.id) {
    const err = new Error("Forbidden");
    err.title = "Require proper authorization";
    err.errors = { message: "Forbidden" };
    err.status = 403;
    return next(err);
  }

  await reviewImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

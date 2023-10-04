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
    const err = new Error("Review Image couldn't be found");
    err.title = "Couldn't find a Review Image with the specified id";
    err.errors = { message: "Review Image couldn't be found" };
    err.status = 404;
    return next(err);
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

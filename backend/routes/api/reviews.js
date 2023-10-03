const express = require("express");
const {
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  User,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
        include: {
          model: SpotImage,
          where: { preview: true },
          attributes: ["url"],
        },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const formattedReviews = reviews.reduce((acc, rev) => {
    const { Spot, ReviewImages, ...reviewDetails } = rev.toJSON();
    const { SpotImages, ...spotDetails } = Spot;

    const formattedSpot = { ...spotDetails, previewImage: "" };
    // set previewImage
    if (SpotImages.length) formattedSpot.previewImage = SpotImages[0].url;

    const formattedReview = {
      ...reviewDetails,
      Spot: formattedSpot,
      ReviewImages: ReviewImages,
    };
    acc.push(formattedReview);
    return acc;
  }, []);

  res.json({ Reviews: formattedReviews });
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const review = await Review.findByPk(req.params.reviewId, {
    include: ReviewImage,
  });

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== user.id) {
    return res
      .status(404)
      .json({ message: "Review must belong to the current user" });
  }

  if (review.ReviewImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const newReviewImage = await ReviewImage.create({
    reviewId: review.id,
    ...req.body,
  });

  res.json({ id: newReviewImage.id, url: newReviewImage.url });
});
module.exports = router;

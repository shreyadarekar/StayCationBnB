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

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

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
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const review = await Review.findByPk(req.params.reviewId, {
    include: ReviewImage,
  });

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== user.id) {
    const err = new Error("Forbidden");
    err.title = "Require proper authorization";
    err.errors = { message: "Forbidden" };
    err.status = 403;
    return next(err);
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

// Edit a Review
router.put(
  "/:reviewId",
  [requireAuth, ...validateReview],
  async (req, res, next) => {
    const { user } = req;
    const reviewDetails = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== user.id) {
      const err = new Error("Forbidden");
      err.title = "Require proper authorization";
      err.errors = { message: "Forbidden" };
      err.status = 403;
      return next(err);
    }

    const updatedReview = await review.update(reviewDetails);

    res.json(updatedReview);
  }
);

// Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== user.id) {
    const err = new Error("Forbidden");
    err.title = "Require proper authorization";
    err.errors = { message: "Forbidden" };
    err.status = 403;
    return next(err);
  }

  await review.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

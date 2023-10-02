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

module.exports = router;

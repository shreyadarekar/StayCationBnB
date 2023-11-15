import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviewsBySpotId, getSpot } from "../../../store/spots";
import { useEffect, useState } from "react";
import "./Spot.css";
import OpenModalButton from "../../OpenModalButton";
import ReviewFormModal from "../../ReviewFormModal";
import DeleteReviewModal from "../../DeleteReviewModal";

const Spot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.entries[spotId]);
  const [isLoading, setIsLoading] = useState(true);
  const [revIsLoading, setRevIsLoading] = useState(true);
  const sessionUser = useSelector((state) => state.session.user);

  const refetchSpot = () => {
    setIsLoading(true);
    setRevIsLoading(true);

    dispatch(getSpot(spotId)).then(() => setIsLoading(false));

    dispatch(getReviewsBySpotId(spotId)).then(() => setRevIsLoading(false));
  };

  useEffect(() => {
    dispatch(getSpot(spotId)).then(() => setIsLoading(false));

    dispatch(getReviewsBySpotId(spotId)).then(() => setRevIsLoading(false));
  }, [dispatch, spotId]);

  if (isLoading) return <h1>Loading...</h1>;

  const {
    name,
    ownerId,
    description,
    city,
    state,
    country,
    SpotImages,
    avgStarRating,
    numReviews,
    price,
    Owner: { firstName, lastName },
    Reviews,
  } = spot;

  const loggedInUserReview =
    Reviews && sessionUser
      ? Reviews.find((rev) => rev.userId === sessionUser.id)
      : undefined;

  const previewImage = SpotImages.find((img) => img.preview === true);
  const otherImages = SpotImages.filter((img) => img.preview !== true);

  const reviewsComponent = (
    <div>
      <i className="fa-solid fa-star"></i>{" "}
      {numReviews ? (
        <>
          {avgStarRating.toFixed(1)} . {numReviews}{" "}
          {numReviews > 1 ? "reviews" : "review"}
        </>
      ) : (
        "New"
      )}
    </div>
  );

  return (
    <div className="spot-detail-div">
      <div>
        <h1 style={{ marginBottom: 0 }}>{name}</h1>
      </div>
      <div>
        <h3>
          {city}, {state}, {country}
        </h3>
      </div>
      <div className="spot-detail-images">
        <img
          className="spot-detail-preview-image"
          src={previewImage.url}
          alt="previewImage"
        />
        {otherImages.map((img) => (
          <img
            className="spot-detail-other-image"
            key={img.id}
            src={img.url}
            alt="otherImg"
          />
        ))}
      </div>
      <div className="spot-detail-under-images">
        <div style={{ marginRight: "20px" }}>
          <h2>
            Hosted by {firstName} {lastName}
          </h2>
          <p>{description}</p>
        </div>
        <div className="spot-detail-price-review-box">
          <div className="spot-detail-price-review-content">
            <div>
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                ${price}
              </span>{" "}
              night
            </div>
            <div>{reviewsComponent}</div>
          </div>
          <div>
            <button
              className="reserve-button"
              onClick={() => alert("Feature Coming Soon...")}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="spot-detail-review-heading">{reviewsComponent}</div>
        <div className="post-review-div">
          {sessionUser && sessionUser.id !== ownerId && !loggedInUserReview && (
            <>
              <OpenModalButton
                className="post-review-button"
                buttonText="Post Your Review"
                modalComponent={
                  <ReviewFormModal spotId={spotId} refetchSpot={refetchSpot} />
                }
              />
              {Reviews && !Reviews.length && (
                <p>Be the first to post a review!</p>
              )}
            </>
          )}
        </div>
        <div>
          {!revIsLoading &&
            Reviews.sort(
              (rev1, rev2) =>
                new Date(rev2.createdAt) - new Date(rev1.createdAt)
            ).map((rev) => (
              <div key={rev.id} className="spot-detail-review">
                <div className="spot-detail-review-firstName">
                  {rev.User.firstName}
                </div>
                <div className="spot-detail-review-timestamp">
                  {new Date(rev.createdAt).toLocaleString("default", {
                    month: "long",
                  })}
                  &nbsp;
                  {new Date(rev.createdAt).getFullYear()}
                </div>
                <p>{rev.review}</p>
                {sessionUser && rev.User.id === sessionUser.id && (
                  <OpenModalButton
                    className="delete-review-button"
                    buttonText="Delete"
                    modalComponent={
                      <DeleteReviewModal
                        reviewId={rev.id}
                        refetchSpot={refetchSpot}
                      />
                    }
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Spot;

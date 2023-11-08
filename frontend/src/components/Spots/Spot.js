import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import { useEffect } from "react";

const Spot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.data[spotId]);

  useEffect(() => {
    dispatch(getSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <h1>Loading...</h1>;

  const {
    name,
    city,
    state,
    country,
    SpotImages,
    avgStarRating,
    numReviews,
    price,
    Owner: { firstName, lastName },
  } = spot;

  const previewImage = SpotImages.find((img) => img.preview === true);
  const otherImages = SpotImages.filter((img) => img.preview !== true);

  return (
    <div className="spot-div">
      <div>{name}</div>
      <div>
        {city}, {state}, {country}
      </div>
      <div>
        <img src={previewImage.url} alt="previewImage" />
        {otherImages.map((img) => (
          <img key={img.id} src={img.url} alt="otherImg" />
        ))}
      </div>
      <div>
        <div>
          Hosted by {firstName} {lastName}
        </div>
        <div>
          <div>
            <div>${price} night</div>
            <div>
              <div>
                <i className="fa-solid fa-star"></i> {avgStarRating}
              </div>{" "}
              . <div>{numReviews} reviews</div>
            </div>
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
    </div>
  );
};

export default Spot;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getSpots } from "../../store/spots";
import "./Spots.css";

const Spots = () => {
  const dispatch = useDispatch();
  const spotsObj = useSelector((state) => state.spots.entries);
  const spots = Object.values(spotsObj);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getSpots()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="spots-grid">
      {spots.map((spot) => (
        <NavLink
          key={spot.id}
          className="spot-div"
          to={`/spots/${spot.id}`}
          title={spot.name}
        >
          <div className="spot-image-div">
            <img className="spot-image" src={spot.previewImage} alt="preview" />
          </div>
          <div className="spot-location-stars">
            <div>
              {spot.city}, {spot.state}
            </div>
            <div>
              <i className="fa-solid fa-star"></i>{" "}
              <span style={{ fontWeight: "bold" }}>
                {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New"}
              </span>
            </div>
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Spots;

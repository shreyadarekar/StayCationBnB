import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getCurrentUserSpots } from "../../../store/spots";
import "./Spots.css";

const ManageSpots = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const spotsObj = useSelector((state) => state.spots.current);
  const spots = Object.values(spotsObj);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getCurrentUserSpots()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Manage Your Spots</h2>
      <button
        className="action-button"
        onClick={() => history.push("/spots/new")}
      >
        Create a New Spot
      </button>

      <div className="spots-grid">
        {spots.map((spot) => (
          <NavLink
            key={spot.id}
            className="spot-div"
            to={`/spots/${spot.id}/edit`}
            title={spot.name}
          >
            <div className="spot-image-div">
              <img
                className="spot-image"
                src={spot.previewImage}
                alt="preview"
              />
            </div>
            <div className="spot-location-stars">
              <div>
                {spot.city}, {spot.state}
              </div>
              <div>
                <i className="fa-solid fa-star"></i>{" "}
                <span style={{ fontWeight: "bold" }}>{spot.avgRating}</span>
              </div>
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
            </div>
            <div className="update-delete-buttons">
              <button
                className="action-button"
                onClick={() => history.push(`/spots/${spot.id}/edit`)}
              >
                Update
              </button>
              <button className="action-button">Delete</button>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;

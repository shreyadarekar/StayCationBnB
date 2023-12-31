import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getCurrentUserSpots } from "../../../store/spots";
import "./Spots.css";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpotModal from "../../DeleteSpotModal";

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
      {spots.length === 0 && (
        <button
          className="action-button"
          onClick={() => history.push("/spots/new")}
        >
          Create a New Spot
        </button>
      )}

      <div className="spots-grid">
        {spots.map((spot) => (
          <div key={spot.id} className="spot-div">
            <NavLink
              className="spot-div"
              to={`/spots/${spot.id}`}
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
            </NavLink>
            <div className="update-delete-buttons">
              <button
                className="action-button"
                onClick={() => history.push(`/spots/${spot.id}/edit`)}
              >
                Update
              </button>
              <OpenModalButton
                className="action-button"
                buttonText="Delete"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSpots;

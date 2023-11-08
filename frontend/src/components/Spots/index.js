import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import Spot from "./Spot";
import "./Spots.css";

const Spots = () => {
  const dispatch = useDispatch();
  const spotsObj = useSelector((state) => state.spots.data);
  const spots = Object.values(spotsObj);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  return (
    <div className="spots-grid">
      {spots.map((spot) => (
        <Spot spot={spot} />
      ))}
    </div>
  );
};

export default Spots;

import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css";

const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className="delete-spot-div">
      <h2 style={{ marginBottom: 0 }}>Confirm Delete</h2>
      <p style={{ marginTop: 0, fontSize: "18px" }}>
        Are you sure you want to remove this spot from the listings?
      </p>
      <button
        className="delete-modal-action-button yes-button"
        onClick={() => dispatch(deleteSpot(spotId)).then(() => closeModal())}
      >
        Yes (Delete Spot)
      </button>
      <button
        className="delete-modal-action-button no-button"
        onClick={() => closeModal()}
      >
        No (Keep Spot)
      </button>
    </div>
  );
};
export default DeleteSpotModal;

import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReview.css";
import { deleteReview } from "../../store/reviews";

const DeleteReviewModal = ({ reviewId, refetchSpot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className="delete-review-div">
      <h2 style={{ marginBottom: 0 }}>Confirm Delete</h2>
      <p style={{ marginTop: 0, fontSize: "18px" }}>
        Are you sure you want to delete this review?
      </p>
      <button
        className="delete-modal-action-button yes-button"
        onClick={() =>
          dispatch(deleteReview(reviewId)).then(() => {
            refetchSpot();
            closeModal();
          })
        }
      >
        Yes (Delete Review)
      </button>
      <button
        className="delete-modal-action-button no-button"
        onClick={() => closeModal()}
      >
        No (Keep Review)
      </button>
    </div>
  );
};
export default DeleteReviewModal;

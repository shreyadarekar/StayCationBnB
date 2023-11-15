import { csrfFetch } from "./csrf";

export const deleteReview = (reviewId) => async () => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  return response;
};

const initialState = { entries: {} };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reviewsReducer;

import { csrfFetch } from "./csrf";

const STORE_SPOTS = "spots/STORE_SPOTS";
const STORE_SPOT = "spots/STORE_SPOT";
const STORE_REVIEWS = "spots/STORE_REVIEWS";
const STORE_CURRENT_SPOTS = "spots/STORE_CURRENT_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";

const storeSpots = (spots) => {
  return {
    type: STORE_SPOTS,
    spots,
  };
};

const storeSpot = (spot) => {
  return {
    type: STORE_SPOT,
    spot,
  };
};

const storeReviews = (spotId, reviews) => {
  return {
    type: STORE_REVIEWS,
    spotId,
    reviews,
  };
};

const storeCurrentUserSpots = (spots) => {
  return {
    type: STORE_CURRENT_SPOTS,
    spots,
  };
};

const removeSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const data = await response.json();
  dispatch(storeSpots(data.Spots));
  return response;
};

export const getSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const data = await response.json();
  dispatch(storeSpot(data));
  return data;
};

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  dispatch(storeReviews(spotId, data.Reviews));
  return response;
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(storeSpot(data));
  return data;
};

export const addImageToSpot = (spotId, image) => async () => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(image),
  });
  return response;
};

export const addReviewToSpot = (spotId, review, stars) => async () => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ review, stars }),
  });
  return response;
};

export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  const data = await response.json();
  dispatch(storeCurrentUserSpots(data.Spots));
  return response;
};

export const updateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spot),
  });
  const data = await response.json();
  dispatch(storeSpot(data));
  return data;
};

export const updateImageToSpot = (spotId, image) => async () => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(image),
  });
  return response;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  dispatch(removeSpot(spotId));
  return response;
};

const initialState = { entries: {}, current: {} };
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SPOTS: {
      const spots = action.spots.reduce((acc, spot) => {
        return { ...acc, [spot.id]: spot };
      }, {});
      return { ...state, entries: spots };
    }

    case STORE_SPOT: {
      return {
        ...state,
        entries: { ...state.entries, [action.spot.id]: action.spot },
      };
    }

    case STORE_REVIEWS: {
      const exitingSpot = state.entries[action.spotId];
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.spotId]: { ...exitingSpot, Reviews: action.reviews },
        },
      };
    }

    case STORE_CURRENT_SPOTS: {
      const spots = action.spots.reduce((acc, spot) => {
        return { ...acc, [spot.id]: spot };
      }, {});
      return { ...state, current: spots };
    }

    case DELETE_SPOT: {
      const newEntries = { ...state.entries };
      delete newEntries[action.spotId];
      const newCurrent = { ...state.current };
      delete newCurrent[action.spotId];
      return { ...state, entries: newEntries, current: newCurrent };
    }

    default:
      return state;
  }
};

export default spotsReducer;

import { csrfFetch } from "./csrf";

const STORE_SPOTS = "spots/STORE_SPOTS";
const STORE_SPOT = "spots/STORE_SPOT";
const STORE_REVIEWS = "spots/STORE_REVIEWS";
const ADD_SPOT = "spots/ADD_SPOT";

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

const storeReviews = (reviews) => {
  return {
    type: STORE_REVIEWS,
    reviews,
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
  return response;
};

export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  dispatch(storeReviews(data.Reviews));
  return response;
};

// export const createSpot = (spot) => async (dispatch) => {
//   const
// };

const initialState = { data: {}, current: {}, isLoading: false };
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SPOTS: {
      const spots = action.spots.reduce((acc, spot) => {
        return { ...acc, [spot.id]: spot };
      }, {});
      return { ...state, data: spots };
    }

    case STORE_SPOT: {
      return { ...state, current: action.spot };
    }

    case STORE_REVIEWS: {
      return {
        ...state,
        current: { ...state.current, Reviews: action.reviews },
      };
    }

    default:
      return state;
  }
};

export default spotsReducer;

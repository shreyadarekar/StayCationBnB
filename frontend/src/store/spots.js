import { csrfFetch } from "./csrf";

const STORE_SPOTS = "spots/storeSpots";
const STORE_SPOT = "spots/storeSpot";

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

const initialState = { data: {}, isLoading: false };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SPOTS: {
      const spots = action.spots.reduce((acc, spot) => {
        return { ...acc, [spot.id]: spot };
      }, {});
      return { ...state, data: spots };
    }

    case STORE_SPOT: {
      return {
        ...state,
        data: { ...state.data, [action.spot.id]: action.spot },
      };
    }

    default:
      return state;
  }
};

export default spotsReducer;

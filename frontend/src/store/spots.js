import { csrfFetch } from "./csrf";

const STORE_SPOTS = "spots/storeSpots";

const storeSpots = (spots) => {
  return {
    type: STORE_SPOTS,
    spots,
  };
};

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const data = await response.json();
  dispatch(storeSpots(data.Spots));
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
    default:
      return state;
  }
};

export default spotsReducer;

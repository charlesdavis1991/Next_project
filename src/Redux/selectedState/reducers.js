import { SET_SELECTED_STATE } from "./actions";

const initialState = {
  selectedState: "CA",
};

const selectedStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_STATE:
      return {
        ...state,
        selectedState: action.payload,
      };
    default:
      return state;
  }
};

export default selectedStateReducer;

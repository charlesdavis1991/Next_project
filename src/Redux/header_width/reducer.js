import { SET_DYNAMIC_WIDTH } from "./action";

const initialState = {
  dynamicWidth: 363, // Default width
};

const dynamicWidthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DYNAMIC_WIDTH:
      return {
        ...state,
        dynamicWidth: action.payload,
      };
    default:
      return state;
  }
};

export default dynamicWidthReducer;

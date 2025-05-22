import { SET_HEADER_NAME } from "./action";

const initalState = {
  header_name: "Case",
};

const setHeaderNamerReducer = (state = initalState, action) => {
  switch (action.type) {
    case SET_HEADER_NAME:
      return {
        ...state,
        header_name: action.payload,
      };
    default:
      return state;
  }
};

export default setHeaderNamerReducer;

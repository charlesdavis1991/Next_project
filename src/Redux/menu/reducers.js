import { TOGGLE_LEFT_SIDEBAR } from "./actions";
import { CLOSE_LEFT_SIDEBAR } from "./actions";

const initialState = {
  isOpen: false,
};
const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LEFT_SIDEBAR:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case CLOSE_LEFT_SIDEBAR:
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

export default menuReducer;

import { SET_HEADER_CHECKLIST_OPEN } from "./action";

const initalState = {
  open: false,
};

const headerChecklistOpen = (state = initalState, action) => {
  switch (action.type) {
    case SET_HEADER_CHECKLIST_OPEN:
      return {
        ...state,
        open: action.payload,
      };
    default:
      return state;
  }
};

export default headerChecklistOpen;

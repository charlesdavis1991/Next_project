import { SET_BLUR_EFFECT } from "./action";

const initalState = {
  blurEffect: false,
};

const blurEffectReducer = (state = initalState, action) => {
  switch (action.type) {
    case SET_BLUR_EFFECT:
      return {
        ...state,
        blurEffect: action.payload,
      };
    default:
      return state;
  }
};

export default blurEffectReducer;

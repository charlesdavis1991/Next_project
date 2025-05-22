import { SET_COMPONENT_LOADING, SET_COMMON_LOADING } from "./action";

const initialState = {
  loadEffect: false,
  componentLoadStates: {
    medicalProviders: false,
    detailBar: false,
  },
};

const commonLoadingEffectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMPONENT_LOADING:
      const updatedComponentLoadStates = {
        ...state.componentLoadStates,
        [action.payload.component]: action.payload.value,
      };

      const anyLoading = Object.values(updatedComponentLoadStates).some(
        (loading) => loading
      );

      return {
        ...state,
        componentLoadStates: updatedComponentLoadStates,
        loadEffect: anyLoading,
      };

    case SET_COMMON_LOADING:
      return {
        ...state,
        loadEffect: action.payload,
      };

    default:
      return state;
  }
};

export default commonLoadingEffectReducer;

export const SET_COMPONENT_LOADING = "SET_COMPONENT_LOADING";
export const SET_COMMON_LOADING = "SET_COMMON_LOADING";

export const setComponentLoadingEffect = (component, value) => ({
  type: SET_COMPONENT_LOADING,
  payload: { component, value },
});

export const setCommonLoadingEffect = (loadEffect) => ({
  type: SET_COMMON_LOADING,
  payload: loadEffect,
});

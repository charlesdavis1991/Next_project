//State Filter dropdown DirectoryPage
export const SET_SELECTED_STATE = "SET_SELECTED_STATE";

export const setSelectedState = (selectedState) => {
  return {
    type: SET_SELECTED_STATE,
    payload: selectedState,
  };
};

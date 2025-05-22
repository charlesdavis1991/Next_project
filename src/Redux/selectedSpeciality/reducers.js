import { SET_SELECTED_SPECIALITY } from "./actions";

const initialState = {
  selectedSpeciality: "7",
};

const selectedSpecialityReducer = (speciality = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_SPECIALITY:
      return {
        ...speciality,
        selectedSpeciality: action.payload,
      };
    default:
      return speciality;
  }
};

export default selectedSpecialityReducer;
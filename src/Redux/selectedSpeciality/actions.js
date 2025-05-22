//State Filter dropdown DirectoryPage
export const SET_SELECTED_SPECIALITY = "SET_SELECTED_SPECIALITY";

export const setSelectedSpeciality = (selectedSpeciality) => {
  return {
    type: SET_SELECTED_SPECIALITY,
    payload: selectedSpeciality,
  };
};

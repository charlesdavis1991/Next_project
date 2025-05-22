import {
  SET_LOADING,
  SET_INJURIES_DATA,
  MODIFY_INJURIES_DATA,
  MODIFY_PREEXIST_INJURIES_DATA,
  UPDATE_INJURIES
} from "./actions";

const initialState = {
  loading: false,
  injuriesData: [],
};

const injuriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_INJURIES_DATA:
      return { ...state, injuriesData: action.payload };

    case MODIFY_INJURIES_DATA:
      const { redInjuries, selectedPart, image, injuries } = action.payload;
      const isSelected =
        state?.injuriesData?.selected_body_parts?.includes(selectedPart);
      let updatedSelectedBodyParts;
      let updatedSpineUrl;

      if (isSelected) {
        updatedSelectedBodyParts =
          state?.injuriesData?.selected_body_parts?.filter(
            (part) => part !== selectedPart
          );
      } else {
        updatedSelectedBodyParts = [
          ...state?.injuriesData?.selected_body_parts,
          selectedPart,
        ];
      }

      if (selectedPart === "spine") {
        updatedSpineUrl = image;
      } else {
        updatedSpineUrl = state?.injuriesData?.spine_url;
      }

      const updatedInjuriesData = {
        ...state.injuriesData,
        red_injuries: redInjuries,
        selected_body_parts: updatedSelectedBodyParts,
        spine_url: updatedSpineUrl,
        injuries: injuries,
      };

      return { ...state, injuriesData: updatedInjuriesData };

    case UPDATE_INJURIES:
      return {
        ...state,
        injuriesData: {
          ...state.injuriesData,
          injuries: action.payload,
        },
      };

    case MODIFY_PREEXIST_INJURIES_DATA:
      const { selectedPart: preexisPart } = action.payload;
      const isPreExistingSelected =
        state?.injuriesData?.pre_existing_injuries?.includes(preexisPart);
      let updatedPreExistingInjuries;

      if (isPreExistingSelected) {
        updatedPreExistingInjuries =
          state?.injuriesData?.pre_existing_injuries?.filter(
            (part) => part !== preexisPart
          );
      } else {
        updatedPreExistingInjuries = [
          ...state?.injuriesData?.pre_existing_injuries,
          preexisPart,
        ];
      }

      const updatedPreExistingInjuriesData = {
        ...state.injuriesData,
        pre_existing_injuries: updatedPreExistingInjuries,
      };

      return { ...state, injuriesData: updatedPreExistingInjuriesData };

    default:
      return state;
  }
};

export default injuriesReducer;

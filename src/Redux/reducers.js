import {
  SET_CASES,
  SET_CLIENT,
  SET_CURRENT_CASE,
  SET_LAST_ACCESSED_CASES,
  SET_PAGES,
  SET_ALL_CLIENTS,
  SET_TODOS,
  SET_TODO_TABS,
  SET_SEARCH_TABLE_LOADER,
  SET_ERROR,
  SET_LOADING,
  SET_INJURIES_DATA,
  SET_CURRENT_TODOS_TAB,
  MODIFY_INJURIES_DATA,
  MODIFY_PREEXIST_INJURIES_DATA,
} from "./actions";

const initialState = {
  searchResults: [],
  currentSearchStatus: "clients",
  currentTab: "client-name",

  searchName: "A",
  searchText: "",
  searchTableLoader: false,
  loginLoader: false,
  tabsResultCount: {
    "client-name": 0,
    "client-email": 0,
    defendant: 0,
    witness: 0,
    claim: 0,
    "court-case": 0,
    otherparty: 0,
    address: 0,
    notes: 0,
    document: 0,
  },
  loading: false,
  error: null,
  cases: [],
  client: null,
  currentCase: null,
  lastAccessedCases: [],
  pages: [],
  allClients: [],
  todos: [],
  todoTabs: [],
  injuriesData: [],
  todosTab: 0,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CASES:
      return { ...state, cases: action.payload };
    case SET_CLIENT:
      return { ...state, client: action.payload };
    case SET_CURRENT_CASE:
      return { ...state, currentCase: action.payload };
    case SET_LAST_ACCESSED_CASES:
      return { ...state, lastAccessedCases: action.payload };
    case SET_PAGES:
      return { ...state, pages: action.payload };
    case SET_ALL_CLIENTS:
      return { ...state, allClients: action.payload };
    case SET_TODOS:
      return { ...state, todos: action.payload };
    case SET_TODO_TABS:
      return { ...state, todoTabs: action.payload };
    case SET_CURRENT_TODOS_TAB:
      return { ...state, todosTab: action.payload };
    case SET_SEARCH_TABLE_LOADER:
      return { ...state, searchTableLoader: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };

    case SET_INJURIES_DATA:
      return { ...state, injuriesData: action.payload };

    case MODIFY_INJURIES_DATA:
      const { redInjuries, selectedPart, image, injuries } = action.payload;
      const isSelected =
        state?.injuriesData?.selected_body_parts?.includes(selectedPart);
      let updatedSelectedBodyParts;
      let updatedSpineUrl;

      if (isSelected) {
        // Remove the part if it's already selected
        updatedSelectedBodyParts =
          state?.injuriesData?.selected_body_parts?.filter(
            (part) => part !== selectedPart
          );
      } else {
        // Add the part if it's not already selected
        updatedSelectedBodyParts = [
          ...state?.injuriesData?.selected_body_parts,
          selectedPart,
        ];
      }

      // Check if the selected part is spine
      if (selectedPart === "spine") {
        updatedSpineUrl = image; // Update spine_url with the provided image
      } else {
        updatedSpineUrl = state?.injuriesData?.spine_url; // Keep the spine_url unchanged if the selected part is not spine
      }

      const updatedInjuriesData = {
        ...state.injuriesData,
        red_injuries: redInjuries,
        selected_body_parts: updatedSelectedBodyParts,
        spine_url: updatedSpineUrl,
        injuries: injuries,
      };

      return { ...state, injuriesData: updatedInjuriesData };

    case MODIFY_PREEXIST_INJURIES_DATA:
      const { selectedPart: preexisPart } = action.payload;
      const isPreExistingSelected =
        state?.injuriesData?.pre_existing_injuries?.includes(preexisPart);
      let updatedPreExistingInjuries;

      if (isPreExistingSelected) {
        // Remove the part if it's already selected
        updatedPreExistingInjuries =
          state?.injuriesData?.pre_existing_injuries?.filter(
            (part) => part !== preexisPart
          );
      } else {
        // Add the part if it's not already selected
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

export default rootReducer;

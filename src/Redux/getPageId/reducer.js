import { GET_PAGE_ID } from "./action";

const initalState = {
  page_id_click_record: 0,
};

const getPageIdReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_PAGE_ID:
      return {
        ...state,
        page_id_click_record: action.payload,
      };
    default:
      return state;
  }
};

export default getPageIdReducer;

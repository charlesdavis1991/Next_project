export const FETCH_NOTES_CATEGORY_DATA_BEGIN = "FETCH_NOTES_CATEGORY_DATA_BEGIN";
export const FETCH_NOTES_CATEGORY_DATA_SUCCESS = "FETCH_NOTES_CATEGORY_DATA_SUCCESS";
export const FETCH_NOTES_CATEGORY_DATA_FAILURE = "FETCH_NOTES_CATEGORY_DATA_FAILURE";

export const ASSIGN_TODO_REQUEST = 'ASSIGN_TODO_REQUEST';
export const ASSIGN_TODO_SUCCESS = 'ASSIGN_TODO_SUCCESS';
export const ASSIGN_TODO_FAILURE = 'ASSIGN_TODO_FAILURE';


export const fetchNotesCategoryDataBegin = () => ({
  type: FETCH_NOTES_CATEGORY_DATA_BEGIN,
});

export const fetchNotesCategoryDataSuccess = (notes) => ({
  type: FETCH_NOTES_CATEGORY_DATA_SUCCESS,
  payload: { notes },
});

export const fetchNotesCategoryDataFail = (error) => ({
  type: FETCH_NOTES_CATEGORY_DATA_FAILURE,
  payload: { error },
});

export const fetchNotesCategoryData = (client_id, case_id) => {
  return (dispatch) => {
    dispatch(fetchNotesCategoryDataBegin());
    api
      .get(`/api/notes/${client_id}/${case_id}/`)
      .then((response) => {
        dispatch(fetchNotesCategoryDataSuccess(response.data));
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(fetchNotesCategoryDataFail(error));
      });
  };
};

//U2024/23/5/11:46PM 
export const assignTodoRequest = () => ({
  type: ASSIGN_TODO_REQUEST,
});

export const assignTodoSuccess =  (data) => ({
  type: ASSIGN_TODO_SUCCESS,
  payload: data,
});

export const assignTodoFailure = (error) => ({
  type: ASSIGN_TODO_FAILURE,
  payload: error,
});
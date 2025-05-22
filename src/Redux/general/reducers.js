const initialState = {
    inactivityTimeout: 10,
    statusLoader: false,
    toDoCount: 0,
    flaggedPageCount: 0
}
  
const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_INACTIVITY_TIMEOUT":
            return { ...state, inactivityTimeout: action.payload };    
        case "SET_STATUS_LOADER":
            return { ...state, statusLoader: action.payload };        
        case "SET_TO_DO_COUNT":
            return { ...state, toDoCount: action.payload };        
        case "SET_FLAGGED_PAGE_COUNT":
            return { ...state, flaggedPageCount: action.payload };            
        default:
            return state;
    }
};
  
  export default generalReducer;
  
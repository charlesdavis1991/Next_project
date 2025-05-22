const initialState = {
    userProfile: {},
    providerClients: [],
    threads: [],
    staffThreads: [],
    clientUserIds: [],
    clientThreads: [],
    recentThreads: [],
    pages: [],
    client: {},
    providers: [],
    userCase: {},
    actualUser: {},
    currentUser: {},
    caseStatuses: [],
    caseStages: [],
    currentCase: {},
    lastAccessedCases: [],
    currentTodos: [],
    page: {},
    litigation: {},
    firmUsers: [],
    finalChecklist: [],
    totalMarked: 0,
    totalChecklists: 0,
    checklistPercentage: 0,
    stages: [],
    timeNow: null,
    activeEntity: "CoWorker",
    activeSubject: {'type': "CoWorker", "thread": null},
    activeEntityId: null,
    totalChatCount: 0,
}
  
const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_PROFILE":
            return { ...state, userProfile: action.payload };
        case "SET_PROVIDER_CLIENTS":
            return { ...state, providerClients: action.payload };
        case "SET_THREADS":
            return { ...state, threads: action.payload };
        case "SET_STAFF_THREADS":
            return { ...state, staffThreads: action.payload };
        case "SET_CLIENT_USER_IDS":
            return { ...state, clientUserIds: action.payload };
        case "SET_CLIENT_THREADS":
            return { ...state, clientThreads: action.payload };
        case "SET_RECENT_THREAD":
            return { ...state, recentThreads: action.payload };
        case "SET_PAGES":
            return { ...state, pages: action.payload };
        case "SET_CLIENT":
            return { ...state, client: action.payload };
        case "SET_PROVIDERS":                                            
            return { ...state, providers: action.payload };
        case "SET_USER_CASE":
            return { ...state, userCase: action.payload };
        case "SET_ACTUAL_USER":
            return { ...state, actualUser: action.payload };
        case "SET_CURRENT_USER":
            return { ...state, currentUser: action.payload };
        case "SET_CASE_STATUSES":
            return { ...state, caseStatuses: action.payload };
        case "SET_CASE_STAGES":
            return { ...state, caseStages: action.payload };
        case "SET_CURRENT_CASE":
            return { ...state, currentCase: action.payload };
        case "SET_LAST_ACCESSED_CASES":
            return { ...state, lastAccessedCases: action.payload };
        case "SET_CURRENT_TODOS":
            return { ...state, currentTodos: action.payload };
        case "SET_PAGE":
            return { ...state, page: action.payload };
        case "SET_LITIGATION":
            return { ...state, litigation: action.payload };
        case "SET_FIRM_USERS":
            return { ...state, firmUsers: action.payload };
        case "SET_FINAL_CHECKLIST":
            return { ...state, finalChecklist: action.payload };
        case "SET_TOTAL_MARKED":
            return { ...state, totalMarked: action.payload };
        case "SET_TOTAL_CHECKLISTS":
            return { ...state, totalChecklists: action.payload };
        case "SET_CHECKLIST_PERCENTAGE":
            return { ...state, checklistPercentage: action.payload };
        case "SET_STAGES":
            return { ...state, stages: action.payload };
        case "SET_TIME_NOW":
            return { ...state, timeNow: action.payload };
        case "SET_ACTIVE_ENTITY":
            return { ...state, activeEntity: action.payload };
        case "SET_ACTIVE_SUBJECT":
            return { ...state, activeSubject: action.payload };
        case "SET_ACTIVE_ENTITY_ID":
            return { ...state, activeEntityId: action.payload };    
        case "SET_TOTAL_CHAT_COUNT":
            return { ...state, totalChatCount: action.payload };    
        default:
            return state;
    }
};
  
  export default chatReducer;
  
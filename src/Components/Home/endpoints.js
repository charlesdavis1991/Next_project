const BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api/home";

const ENDPOINTS = {
    GET_CHATS:(client_id, case_id) => `${BASE_URL}/chats/?client_id=${client_id}&case_id=${case_id}`,
    GET_POSTS:(client_id, case_id) => `${BASE_URL}/posts/?client_id=${client_id}&case_id=${case_id}`,
    GET_TIME:(client_id, case_id)  => `${BASE_URL}/time-events/?client_id=${client_id}&case_id=${case_id}`,
    GET_CASE:(client_id, case_id)  => `${BASE_URL}/case-detail/?client_id=${client_id}&case_id=${case_id}`,
    GET_PINNEDCASE:(client_id, case_id) => `${BASE_URL}/pinned-cases/?client_id=${client_id}&case_id=${case_id}`,
    GET_FIRMUSERS:(client_id, case_id) => `${BASE_URL}/firmuser-preferences/?client_id=${client_id}&case_id=${case_id}`,
    // Add more endpoints as needed
};

export default ENDPOINTS;

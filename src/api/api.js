import axios from "axios";
import { getToken } from "../Utils/helper";
// Set the origin URL
const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

const api = axios.create({
  baseURL: origin,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api_without_cancellation = axios.create({
  baseURL: origin,
  headers: {
    "Content-Type": "application/json",
  },
});

// A map to store pending requests and their cancel tokens
const pendingRequests = new Map();
// Function to generate a unique request key based on config
const getRequestKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
};
// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add Authorization header if a token is available
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    // Generate a unique key for the request
    const requestKey = getRequestKey(config);
    // Check if the request is already pending
    if (pendingRequests.has(requestKey)) {
      // Cancel the duplicate request
      return Promise.reject(new axios.Cancel("Duplicate request canceled"));
    }
    // Create a new cancel token and add it to the pending requests map
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    pendingRequests.set(requestKey, cancelTokenSource);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Remove completed requests from pendingRequests
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    const { config } = error;

    // If the request was canceled, avoid further handling
    if (axios.isCancel(error)) {
      console.log(error.message);
    } else {
      // Remove the request from pendingRequests on other errors
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }

    return Promise.reject(error);
  }
);
export const cancelPendingRequests = () => {
  pendingRequests.forEach((cancelTokenSource, requestKey) => {
    cancelTokenSource.cancel(`Request ${requestKey} canceled.`);
  });
  pendingRequests.clear();
};
export default api;




// Request interceptor
api_without_cancellation.interceptors.request.use(
  (config) => {
    // Add Authorization header if a token is available
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
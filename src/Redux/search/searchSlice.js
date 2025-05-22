import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getClientId, getCaseId } from "../../Utils/helper";
import { setSearchTabResults } from "../actions";
import axios from "axios";

const origin = process.env.REACT_APP_BACKEND_URL;
const node_env = process.env.NODE_ENV;
const token = localStorage.getItem("token");

// Define the async thunk for setting updating Tab Name
export const updateTabName = createAsyncThunk(
  "updateTabName",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/updateTabName/", data);
      return response.data;
    } catch (error) {
      if (!error.response) {
        // network error
        throw error;
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const searchClientAPI = createAsyncThunk(
  "searchClientAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${origin}/api/search-client-api/`,
        data,
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        // network error
        throw error;
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const searchGlobal = createAsyncThunk(
  "searchGlobal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${origin}/api/search/global-search/${getClientId()}/${getCaseId()}/`,
        { name: data.name, tab_name: data.tab_name },
        {
          headers: { Authorization: data.token },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        // network error
        throw error;
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const searchGlobalOnLogin = createAsyncThunk(
  "searchGlobalOnLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${origin}/api/search/global-search/${getClientId()}/${getCaseId()}/`,
        { name: data.name, tab_name: data.tab_name },
        {
          headers: { Authorization: data.token },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        // network error
        throw error;
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const SearchTabsApi = createAsyncThunk(
  "SearchTabsApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/search/SearchTabsApi/?tab=${data.currentTab}`,
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        // network error
        throw error;
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//   Intitial State
const initialState = {
  currentSearchStatus: "",
  searchResult: {},
  searchTabResult: [],
  searchResultGlobal: [],
  searchType: "",
  currentTab: "",
  searchText: "",
  loginSearchText: "",
  searchAlphabet: false,
  searchTextChanged: "",
  currentCase: "",
  searchRecordId: "",
  searchNoteId: "",
  searchDocument: "",
  showAssignTodoModal: false,
  loading: false,
  hasData: true,
  nonZeroTabs: [],
  showAssignTodoModalMessage: "",
  error: null,
  selectedCategory: "Case",
  tabsResultCount: {
    invoice: 0,
    incident: 0,
    "incident-date": 0,
    check: 0,
    "client-name": 0,
    "client-email": 0,
    "client-SSN": 0,
    "client-phone": 0,
    "client-birthday": 0,
    defendant: 0,
    "defendant-phone": 0,
    witness: 0,
    claim: 0,
    "court-case": 0,
    otherparty: 0,
    address: 0,
    notes: 0,
    document: 0,
  },
  firmUserPreferences: null,
};

const searchSlice = createSlice({
  name: "searchS",
  initialState,
  reducers: {
    setCurrentSearchStatus: (state, action) => {
      state.currentSearchStatus = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setsearchAlphabet: (state, action) => {
      state.searchAlphabet = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setSearchResult: (state, action) => {
      try {
        // Check if action.payload is an object and is not undefined
        if (action.payload && typeof action.payload === "object") {
          // If 'client-lastname' exists in the payload and it's an array
          if (
            action.payload?.["client-lastname"] &&
            Array.isArray(action.payload?.["client-lastname"])
          ) {
            // Preprocess the 'client-lastname' array to store uppercased versions of the names
            const lastNames = action.payload?.["client-lastname"]?.map((name) =>
              name?.case_data?.for_client?.last_name?.toUpperCase()
            );

            // Sort the 'client-lastname' array using the preprocessed uppercase version
            action.payload?.["client-lastname"]?.sort((a, b) => {
              const indexA =
                lastNames?.[action.payload?.["client-lastname"]?.indexOf(a)];
              const indexB =
                lastNames?.[action.payload?.["client-lastname"]?.indexOf(b)];
              return indexA?.localeCompare(indexB);
            });
          }

          // Save the updated payload to the Redux state
          state.searchResult = action.payload;
        } else {
          // If action.payload is undefined or not an object, handle appropriately
          state.searchResult = {}; // Default to empty object or handle accordingly
        }
      } catch (error) {
        // Handle any unexpected errors gracefully
        state.searchResult = {}; // Default to empty object on error
      }
    },
    setTabsResultCount: (state, action) => {
      state.tabsResultCount = action.payload;
    },
    setHasData: (state, action) => {
      state.hasData = action.payload;
    },
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    setShowAssignTodoModal: (state, action) => {
      state.showAssignTodoModal = action.payload;
    },
    setshowAssignTodoModalMessage: (state, action) => {
      state.showAssignTodoModalMessage = action.payload;
    },
    setLoginSearchText: (state, action) => {
      state.loginSearchText = action.payload;
    },
    setSearchRecordId: (state, action) => {
      state.searchRecordId = action.payload;
    },
    setSearchNoteId: (state, action) => {
      state.searchNoteId = action.payload;
    },
    setSearchDocument: (state, action) => {
      state.searchDocument = action.payload;
    },
    SetNonZeroTabs: (state, action) => {
      state.nonZeroTabs = action.payload;
    },
    setSearchResultGlobal: (state, action) => {
      state.searchResultGlobal = action.payload;
    },
    setFirmUserPreferences: (state, action) => {
      state.firmUserPreferences = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTabName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTabName.fulfilled, (state, action) => {
        state.loading = false;
        // state.currentTab = action.payload;
      })
      .addCase(updateTabName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // searchClientAPI Post Request handler
      .addCase(searchClientAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchClientAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      .addCase(searchClientAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Global  Request handler
      .addCase(searchGlobal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGlobal.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = {};
        let tabs_count = {
          "client-lastname": action.payload.data?.ClientLastname || 0,
          "client-name": action.payload.data?.Client || 0,
          "client-phone": action.payload.data?.ClientPhone || 0,
          "defendant-phone": action.payload.data?.DefendantPhone || 0,
          "client-email": action.payload.data?.ClientEmail || 0,
          "client-birthday": action.payload.data?.ClientBirthday || 0,
          "incident-date": action.payload.data?.IncidentDate || 0,
          "client-SSN": action.payload.data?.ClientSSN || 0,
          defendant: action.payload.data?.Defendant || 0,
          witness: action.payload.data?.Witness || 0,
          claim: action.payload.data?.Claim || 0,
          "court-case": action.payload.data?.CourtCase || 0,
          invoice: action.payload.data?.Invoice || 0,
          check: action.payload.data?.Check || 0,
          otherparty: action.payload.data?.OtherParty || 0,
          address: action.payload.data?.Address || 0,
          incident: action.payload.data?.Incident || 0,
          notes: action.payload.data?.Notes || 0,
          document: action.payload.data?.Document || 0,
        };
        state.tabsResultCount = tabs_count;

        // Looking for the First None Zero Tab
        let firstNonZeroKey;
        for (const key in tabs_count) {
          if (tabs_count[key] > 0) {
            if (key == "client-lastname" && state.searchAlphabet == false) {
              continue;
            } else if (state.searchAlphabet == true) {
              state.currentTab = "client-lastname";
            } else {
              firstNonZeroKey = key;
              state.currentTab = firstNonZeroKey;
              break;
            }
          }
        }

        //Looking for searchType i-e alpha, numeric,alphanumeric
        let searchTypeKey;
        let data = action.payload.data;
        for (const key in data) {
          if (key == "alpha" || key == "numeric" || key == "alphanumeric") {
            searchTypeKey = key;
            break;
          }
        }
        state.searchType = searchTypeKey;
        state.searchResultGlobal = action.payload;
        state.searchTextChanged = !state.searchTextChanged;
      })
      .addCase(searchGlobal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Global  on first time login
      .addCase(searchGlobalOnLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGlobalOnLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = {};
        let tabs_count = {
          "client-lastname": action.payload.data?.ClientLastname || 0,
          "client-name": action.payload.data?.Client || 0,
          "client-phone": action.payload.data?.ClientPhone || 0,
          "defendant-phone": action.payload.data?.DefendantPhone || 0,
          "client-email": action.payload.data?.ClientEmail || 0,
          "client-birthday": action.payload.data?.ClientBirthday || 0,
          "incident-date": action.payload.data?.IncidentDate || 0,
          "client-SSN": action.payload.data?.ClientSSN || 0,
          defendant: action.payload.data?.Defendant || 0,
          witness: action.payload.data?.Witness || 0,
          claim: action.payload.data?.Claim || 0,
          "court-case": action.payload.data?.CourtCase || 0,
          invoice: action.payload.data?.Invoice || 0,
          check: action.payload.data?.Check || 0,
          otherparty: action.payload.data?.OtherParty || 0,
          address: action.payload.data?.Address || 0,
          incident: action.payload.data?.Incident || 0,
          notes: action.payload.data?.Notes || 0,
          document: action.payload.data?.Document || 0,
        };
        state.tabsResultCount = tabs_count;

        //Looking for searchType i-e alpha, numeric,alphanumeric
        let searchTypeKey;
        let data = action.payload.data;
        for (const key in data) {
          if (key == "alpha" || key == "numeric" || key == "alphanumeric") {
            searchTypeKey = key;
            break;
          }
        }
        state.searchType = searchTypeKey;
        state.searchResultGlobal = action.payload;
        state.searchTextChanged = !state.searchTextChanged;
      })
      .addCase(searchGlobalOnLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // searchTabApi Get Request handler
      .addCase(SearchTabsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchTabsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.searchTabResult = {
          ...state.searchTabResult,
          [state.currentTab]: action.payload.data,
        };
      })
      .addCase(SearchTabsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {
  setCurrentSearchStatus,
  setCurrentTab,
  setSearchText,
  setsearchAlphabet,
  setSearchType,
  setSearchResult,
  setTabsResultCount,
  setHasData,
  setCurrentCase,
  setShowAssignTodoModal,
  setshowAssignTodoModalMessage,
  setLoginSearchText,
  setSearchRecordId,
  setSearchNoteId,
  setSearchDocument,
  SetNonZeroTabs,
  setSearchResultGlobal,
  setFirmUserPreferences,
  setSelectedCategory,
} = searchSlice.actions;
export default searchSlice.reducer;

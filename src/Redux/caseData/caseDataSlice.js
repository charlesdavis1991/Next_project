import { createSlice } from "@reduxjs/toolkit";
import api, { api_without_cancellation } from "../../api/api";

export const caseDataSlice = createSlice({
  name: "caseData",
  initialState: {
    current: null,
    pages: null,
    stages: null,
    caseStatuteLimitations: null,
    caseCounsellingFirms: null,
    processedPhotoSlots: null,
    lastAccessedCases: null,
    commutativeChecklist: null,
    summary: null,
    isLoading: {
      current: false,
      pages: false,
      stages: false,
      caseStatuteLimitations: false,
      caseCounsellingFirms: false,
      processedPhotoSlots: false,
      lastAccessedCases: false,
      commutativeChecklist: false,
      summary: false,
    },
    error: null,
  },
  reducers: {
    updateClientProfilePic: (state, action) => {
      if (state.summary) {
        state.summary.for_client.profile_pic_63p = action.payload;
      }},
    setCurrentCase: (state, action) => {
      state.current = action.payload;
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    setStages: (state, action) => {
      state.stages = action.payload;
    },
    setCaseStatuteLimitations: (state, action) => {
      state.caseStatuteLimitations = action.payload;
    },
    setCaseCounsellingFirms: (state, action) => {
      state.caseCounsellingFirms = action.payload;
    },
    setProcessedPhotoSlots: (state, action) => {
      state.processedPhotoSlots = action.payload;
    },
    setLastAccessedCases: (state, action) => {
      state.lastAccessedCases = action.payload;
    },
    setCommutativeChecklist: (state, action) => {
      state.commutativeChecklist = action.payload;
    },
    setCaseSummary: (state, action) => {
      state.summary = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateClientProfilePic,
  setCurrentCase,
  setPages,
  setStages,
  setCaseStatuteLimitations,
  setCaseCounsellingFirms,
  setProcessedPhotoSlots,
  setLastAccessedCases,
  setCommutativeChecklist,
  setCaseSummary,
  setLoading,
  setError,
} = caseDataSlice.actions;

export const fetchCurrentCase =
  (clientId, caseId) => async (dispatch, getState) => {
    dispatch(setLoading({ key: "current", value: true }));
    try {
      const response = await api_without_cancellation.get(`/api/cases/${clientId}/${caseId}/`);

      dispatch(setCurrentCase(response.data.case));

      dispatch(
        setCaseStatuteLimitations(response.data.case_statute_limitations)
      );
      dispatch(setCaseCounsellingFirms(response.data.case_councelling_firms));
      dispatch(setProcessedPhotoSlots(response.data.processed_photo_slots));
      dispatch(setLastAccessedCases(response.data.last_accessed_cases));
      return response.data;
    } catch (error) {
      console.error("Error occurred while fetching case", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading({ key: "current", value: false }));
    }
  };

export const fetchAllPages = (caseId) => async (dispatch, getState) => {
  dispatch(setLoading({ key: "pages", value: true }));
  try {
    const response = await api.get(`/api/pages/${caseId}/`);
    dispatch(setPages(response.data));
    return response.data
  } catch (error) {
    console.error("Error occurred while fetching pages", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading({ key: "pages", value: false }));
  }
};

export const fetchAllStages = () => async (dispatch, getState) => {
  const stages = getState().caseData?.stages;

  if (!stages) {
    dispatch(setLoading({ key: "stages", value: true }));
    try {
      const response = await api.get(`/api/stages/`);
      dispatch(setStages(response.data));
    } catch (error) {
      console.error("Error occurred while fetching stages", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading({ key: "stages", value: false }));
    }
  }
};

export const fetchCommutativeChecklist =
  (clientId, caseId) => async (dispatch, getState) => {
    const commutativeChecklist = getState().caseData.commutativeChecklist;

    if (!commutativeChecklist) {
      dispatch(setLoading({ key: "commutativeChecklist", value: true }));
      try {
        const response = await api.get(
          `/api/commulative-checklist/${clientId}/${caseId}/`
        );
        dispatch(setCommutativeChecklist(response.data));
      } catch (error) {
        console.error(
          "Error occurred while fetching commutativeChecklist",
          error
        );
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading({ key: "commutativeChecklist", value: false }));
      }
    }
  };

export default caseDataSlice.reducer;

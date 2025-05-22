import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import axios from "axios";

export const clientProviderSlice = createSlice({
  name: "clientProvider",
  initialState: {
    all: null,
    providerData: [],
    editCaseProvider: {},
    isVerifyingOrUnVerifying: null,
    // {
    //   first_date: false,
    //   second_date: false,
    //   visits: false,
    //   final: false,
    //   balance_confirmed: false,
    //   record_ordered: false,
    //   record_received: false,
    //   recordCost: false,
    //   rec_request_paid: false,
    //   billing_ordered: false,
    //   billing_received: false,
    //   billsCost: false,
    //   bills_request_paid: false,
    //   treatment_complete: false,
    // } ,
    editCaseProviderDraft: {},
    specialties: [],
    states: [],
    editCaseProviderTab: "provider-link",
    formSubmittingStatus: {
      provider: "idle",
      treatment_location: "idle",
      billing_request: "idle",
      billing_request_paid: "idle",
      records_request: "idle",
      records_request_paid: "idle",
      lien_holder: "idle",
      treatment_dates: "idle",
      provider_charges: "idle",
    },
    isFormSubmitting: false,
    verifications: {},
    isLoading: {
      all: false,
      editCaseProvider: false,
      specialties: false,
      states: false,
      verifications: false,
    },
    error: null,
  },
  reducers: {
    setBulkProviderData: (state, action) => {
      state.providerData = action.payload;
    },
    setProviderData: (state, action) => {
      state.providerData = [...state.providerData, action.payload];
    },
    updateProviderData: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.providerData.findIndex(item => item.id === id);
      if (index !== -1) {
        state.providerData[index] = { ...updatedData };
      }
    },
    deleteProviderData: (state, action) => {
      const id = action.payload;
      state.providerData = state.providerData.filter(item => item.id !== id);
    },
    setClientProviders: (state, action) => {
      state.all = action.payload;
    },
    setEditCaseProvider: (state, action) => {
      state.editCaseProvider = action.payload;
    },
    setEditCaseProviderDraft: (state, action) => {
      state.editCaseProviderDraft = action.payload;
    },
    setVerifyingOrUnVerifying: (state, action) => {
      state.isVerifyingOrUnVerifying = action.payload;
    },
    setSpecialties: (state, action) => {
      state.specialties = action.payload;
    },
    setStates: (state, action) => {
      state.states = action.payload;
    },
    setEditCaseProviderTab: (state, action) => {
      state.editCaseProviderTab = action.payload;
    },
    // update the form submitting status for the given form key and keep the rest of the statuses as it is
    setFormSubmittingStatus: (state, action) => {
      state.formSubmittingStatus = {
        ...state.formSubmittingStatus,
        [action?.payload?.formKey]: action?.payload?.status,
      };
    },
    setIsFormSubmitting: (state, action) => {
      state.isFormSubmitting = action.payload;
    },
    setVerifications: (state, action) => {
      state.verifications = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = {
        ...state.isLoading,
        [action.payload.key]: action.payload.value,
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBulkProviderData,
  setProviderData,
  updateProviderData,
  deleteProviderData,
  setClientProviders,
  setEditCaseProvider,
  setEditCaseProviderDraft,
  setVerifyingOrUnVerifying,
  setSpecialties,
  setStates,
  setEditCaseProviderTab,
  setFormSubmittingStatus,
  setIsFormSubmitting,
  setVerifications,
  setLoading,
  setError,
} = clientProviderSlice.actions;

export const fetchClientProviderSpecialties = () => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/case-provider-specialties/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error occurred while fetching client-providers", error);
        reject(error.message);
      });
  });
};

export const fetchAllStates = () => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/states/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error occurred while fetching states", error);
        reject(error.message);
      });
  });
};
export const getProviderInfo = async (
  clientId,
  currentCaseId,
  selectedState,
  selectedSpecialty
) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");

  try {
    const client = clientId || null;
    const caseId = currentCaseId || null;
  
    const queryParams = new URLSearchParams();

    if (selectedState?.selectedState) {
      queryParams.append('state', selectedState.selectedState);
    } 
    
    if (selectedSpecialty?.selectedSpeciality) {
      queryParams.append('speciality', selectedSpecialty.selectedSpeciality);
    }

    const response = await axios.get(
      `${origin}/api/add/provider/${client}/${caseId}/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        headers: {
          Authorization: tokenBearer,
        },
      }
    );
    return response.data.data;
  } catch (err) {
      console.error(err);
  }
};
export default clientProviderSlice.reducer;

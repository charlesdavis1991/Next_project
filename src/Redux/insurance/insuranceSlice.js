import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import axios from "axios";
import { getClientId, getCaseId } from "../../Utils/helper";
import { createAsyncThunk } from "@reduxjs/toolkit";





// Define the async thunk for getting Notes
export const fetchInsurances = createAsyncThunk('fetchInsurances', async (req_params, { rejectWithValue }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(origin + '/api/client-page/client-insurance-list/', {
      params: {
        for_client: clientId ? clientId : "",
        for_case: currentCaseId  ? currentCaseId : "",
      },
      headers: {
        Authorization: token,
      },
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
});
export const createInsurance = createAsyncThunk('createInsurance', async (req_params, { rejectWithValue }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(origin + '/api/insurances/' + clientId + '/' + currentCaseId + '/', req_params.data, {
      headers: {
        Authorization: token,
      },
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
});
export const editInsurance = createAsyncThunk('editInsurance', async (req_params, { rejectWithValue }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(origin + '/api/insurances/' + clientId + '/' + currentCaseId + '/', req_params, {
      headers: {
        Authorization: token,
      },
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
});

// Getting data for the Create Insurance form Modal
export const fetchCreateInsuranceModalData = createAsyncThunk('fetchCreateInsuranceModalData', async (req_params, { rejectWithValue }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(origin + '/api/insurances/create/' + clientId + '/' + currentCaseId + '/', {
      headers: {
        Authorization: token,
      },
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
});

export const deleteInsurance = createAsyncThunk('deleteInsurance', async (req_params, { rejectWithValue }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  try{
    const response = await axios.get(origin + '/api/delete_insurance/' + req_params.insurance_id + '/', {
      headers: {
        Authorization: token,
      },
    }
    );
    return response.data;
    }catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue(error.message);
    }
  }
});


//   Intitial State 
const initialState = {
  data: [],
  modalData: [],
  loading: false,
  error: null,
}

const insuranceSlice = createSlice({
  name: 'insurances',
  initialState,
  reducers: {
    // Define any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsurances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsurances.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInsurances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload : action.error.message;
      })


      // Fetching Data for Insurances
      .addCase(fetchCreateInsuranceModalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreateInsuranceModalData.fulfilled, (state, action) => {
        state.loading = false;
        state.modalData = action.payload;
      })
      .addCase(fetchCreateInsuranceModalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload : action.error.message;
      })

      // Adding Insurance 
      .addCase(createInsurance.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(createInsurance.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createInsurance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;

      })

      // Deleting Insurance
      .addCase(deleteInsurance.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(deleteInsurance.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteInsurance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })

      // Editing Insurance 
      .addCase(editInsurance.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(editInsurance.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editInsurance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;

      });

  },
});

export default insuranceSlice.reducer
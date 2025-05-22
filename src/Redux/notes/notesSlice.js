import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";




// Define the async thunk for getting Notes
export const fetchNotes = createAsyncThunk('fetchNotes', async (req_params, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/notes/'+req_params.entity_type+'/'+req_params.record_id);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue(error.message);
        }
      }
  });
export const fetchPages = createAsyncThunk('fetchPages', async (req_params,{ rejectWithValue }) => {
    try {
        const response = await api.get('/api/pages');
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue(error.message);
        }
      }
  });

//   Define the async thuck for adding Notes
export const addNote = createAsyncThunk(
    'addNote',
    async (req_params, { rejectWithValue }) => {
      try {
        const response = await api.post('/api/notes', req_params);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const noteSlice = createSlice({
    name:"notes",
    initialState:{
        isLoading: false,
        data: [],
        pages: [],
        isError: false,
    },
    reducers: {},
  extraReducers: builder => {
    builder
    // Fetching Notes
      .addCase(fetchNotes.pending, state => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })

    //   Fetching Pages
      .addCase(fetchPages.pending, state => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
 

      // Handle adding Note
      .addCase(addNote.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
        
      });
  }

})

export default noteSlice.reducer




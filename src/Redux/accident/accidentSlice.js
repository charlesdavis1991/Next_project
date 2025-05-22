import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const AccidentSlice = createSlice({
  name: "accident",
  initialState: {
    current: {},
    defendants: [],
    notes: [],
    accident_types: [],
    edit_access: false,
    is_firm_admin: false,
    p_edit_users: [],
    editVehicleLocation: {
      id: null,
      vehicle_id: null,
      name: null,
      suffix: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      title: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      phone_number: null,
      email: null,
      fax: null,
      website: null,
      phone_ext: null,
      longitude: null,
      latitude: null,
      for_firm: null,
    },
    carInfo: {
      id: null,
      make: null,
      model: null,
      year: null,
      mileage: null,
      color: null,
      value: null,
    },
    propertyDamage: {
      id: null,
      prop_damage_estimate: null,
      prop_damage_final: null,
    },
    isLoading: {
      current: false,
      defendants: false,
      notes: false,
      accident_types: false,
    },
  },
  reducers: {
    setAccident: (state, action) => {
      state.current = action.payload.accident;
      state.defendants = action.payload.defendants;
      state.notes = action.payload.notes;
      state.accident_types = action.payload.accident_types;
      state.edit_access = action.payload.edit_access;
      state.is_firm_admin = action.payload.is_firm_admin;
      // state.p_edit_users = action.payload.p_edit_users;
    },
    setEditVehicleLocation: (state, action) => {
      state.editVehicleLocation = action.payload;
    },
    setCarInfo: (state, action) => {
      state.carInfo = action.payload;
    },
    setPropertyDamage: (state, action) => {
      state.propertyDamage = action.payload;
    },
    updateAttachedCarContact: (state, action) => {
      const { vehicle_id, ...rest } = action.payload;
      const index = state.current.attchedCars.findIndex((car) => car.id === vehicle_id);
      if (index !== -1) {
        state.current.attchedCars[index].contact = { ...state.current.attchedCars[index].contact, ...rest };
      }
    },
    updateAttachedCarInfo: (state, action) => {
      const { vehicle_id, ...rest } = action.payload;
      const index = state.current.attchedCars.findIndex((car) => car.id === vehicle_id);
      if (index !== -1) {
        const keysToUpdate = Object.keys(rest);
        const updatedData = keysToUpdate.reduce((acc, key) => {
          acc[key] = rest[key];
          return acc;
        }, {});
        state.current.attchedCars[index] = { ...state.current.attchedCars[index], ...updatedData };
      }
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
  setAccident,
  setEditVehicleLocation,
  setCarInfo,
  setPropertyDamage,
  updateAttachedCarContact,
  updateAttachedCarInfo,
  setLoading,
  setError,
} = AccidentSlice.actions;

export const fetchAccidentData =
  (clientId, caseId) => async (dispatch, getState) => {
    const accident = getState().accident.current;

    if (Object.keys(accident).length === 0 || accident.for_case !== caseId) {
      dispatch(setLoading({ key: "accident", value: true }));
      try {
        const response = await api.get(`/api/accidents/${clientId}/${caseId}/`);
        if (response.data) {
          dispatch(setAccident(response.data));
        } else {
          dispatch(setError("No accident data found"));
        }
      } catch (error) {
        console.error("Error occurred while fetching  accident data: ", error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading({ key: "accident", value: false }));
      }
    }
  };

export default AccidentSlice.reducer;

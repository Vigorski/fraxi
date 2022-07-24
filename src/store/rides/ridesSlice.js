import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ridesActive: [],
  ridesHistory: []
}

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    addRide (state, action) {
      state.ridesActive.push(action.payload);
    },
    populateRidesHistory (state, action) {
      state.ridesHistory = action.payload;
    }
  }
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
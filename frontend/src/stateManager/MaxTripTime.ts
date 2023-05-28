import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaxTripTime {
    maxTripTime : number
};

const initialState: MaxTripTime = {
    maxTripTime : 30
};

export const maxTripTimeSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    maxTripTimeChange: (__, action : PayloadAction<number>) => {
      return {
        maxTripTime : action.payload
      };
    }
  },
});

export default maxTripTimeSlice.reducer;
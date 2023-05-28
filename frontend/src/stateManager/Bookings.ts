import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from './Activities';

export interface Booking extends Activity {
  timeslot : string
};

const initialState: Booking[] = [];

export const BookingSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setBooking: (prev, action : PayloadAction<Booking>) => {
      const newState = [...prev];
      newState.push(action.payload) 
      return newState;
    }
  },
});

export default BookingSlice.reducer;
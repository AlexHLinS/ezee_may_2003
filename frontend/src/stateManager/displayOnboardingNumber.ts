import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: number = 0;

export const displayNumberSlice = createSlice({
  name: 'displayNumber',
  initialState,
  reducers: {
    setDisplayNumber: (__, action : PayloadAction<number>) => {
      return action.payload;
    }
  },
});

export default displayNumberSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: number[] = [
   0, 1
];

export const ActivityMapSlice = createSlice({
  name: 'activityMap',
  initialState,
  reducers: {
    setActivityMap: (__, action : PayloadAction<number[]>) => {
      return action.payload;
    }
  },
});

export default ActivityMapSlice.reducer;
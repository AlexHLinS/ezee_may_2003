import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

export const RecommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setReco: (__, action : PayloadAction<string[]>) => {
      return action.payload;
    }
  },
});

export default RecommendationSlice.reducer;
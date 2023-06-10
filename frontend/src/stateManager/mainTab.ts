import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string = 'activityCategories';

export const mainTabSlice = createSlice({
  name: 'displayNumber',
  initialState,
  reducers: {
    setMainTab: (__, action : PayloadAction<'booking' | 'activityCategories'>) => {
      return action.payload;
    }
  },
});

export default mainTabSlice.reducer;
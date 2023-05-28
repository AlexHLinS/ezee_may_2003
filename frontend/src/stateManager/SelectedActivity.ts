import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedActivity {
  id: number
};

const initialState: SelectedActivity = {
    id : -1
}

export const SelectedActivitySlice = createSlice({
  name: 'selectedActivity',
  initialState,
  reducers: {
    setSelectedActivity: (__, action : PayloadAction<number>) => {
      return {
        id : action.payload
      };
    }
  },
});

export default SelectedActivitySlice.reducer;
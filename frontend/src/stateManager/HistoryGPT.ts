import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface History {
    role : string,
    content : string
};

const initialState: History[] = [];

export const historySlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setHistory: (prevAnswer, action : PayloadAction<History[]>) => {
      return action.payload;
    }
  },
})

export default historySlice.reducer
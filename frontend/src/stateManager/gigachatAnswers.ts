import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GigachatAnswer {
  1 : string,
  2 : string,
  3 : string,
  4 : string,
  5 : string,
};

const initialState: GigachatAnswer[] = [];

export const GigachatAnswerSlice = createSlice({
  name: 'gigachatQuestions',
  initialState,
  reducers: {
    setGigachatAnswer: (prev : GigachatAnswer, action : PayloadAction<{
      index : number,
      text : string
    }>) => {
      const {index, text} = action.payload;
      prev[index] = text;
      return prev;
    }
  },
});

export default GigachatAnswerSlice.reducer;
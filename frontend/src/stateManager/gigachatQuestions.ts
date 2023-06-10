import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GigachatQuestion {
  text: string,
  answers : string[]
};

const initialState: GigachatQuestion[] = [
  {
    text : 'Самый лучший вопрос',
    answers : [
      'Самый лучший ответ 1',
      'Самый лучший ответ 2',
      'Самый лучший ответ 3',
    ]
  },
  {
    text : 'Самый лучший вопрос 2',
    answers : [
      'Самый лучший ответ 1',
      'Самый лучший ответ 2',
      'Самый лучший ответ 3',
    ]
  },
  {
    text : 'Самый лучший вопрос 3',
    answers : [
      'Самый лучший ответ 1',
      'Самый лучший ответ 2',
      'Самый лучший ответ 3',
    ]
  }
];

export const GigachatQuestionSlice = createSlice({
  name: 'gigachatQuestions',
  initialState,
  reducers: {
    setGigachatQuestion: (__, action : PayloadAction<GigachatQuestion[]>) => {
      return action.payload;
    }
  },
});

export default GigachatQuestionSlice.reducer;
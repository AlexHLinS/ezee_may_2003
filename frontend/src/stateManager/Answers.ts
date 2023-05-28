import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Answers {
    health_issue : string,
    sociality : string,
    activity : string
};

const initialState: Answers = {
    health_issue : '',
    sociality : '',
    activity : ''
};

export const answerSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    changeAnswer: (prevAnswer, action : PayloadAction<{
        answer : string,
        value : string
    }>) => {
      const newAnswer = {...prevAnswer};
      const {answer, value} = action.payload;

      newAnswer[answer] = value

      return newAnswer;
    }
  },
})

export default answerSlice.reducer
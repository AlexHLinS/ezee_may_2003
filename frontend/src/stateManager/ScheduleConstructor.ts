import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface dayTimes {
    morning : boolean,
    noon : boolean,
    evening : boolean
};

const initialState: dayTimes[] = [];

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    changeSchedule: (prevSchedule, action : PayloadAction<{
        weekday : number,
        dayTime : string
    }>) => {
      const {weekday, dayTime} = action.payload;
      prevSchedule[weekday][dayTime] = !prevSchedule[weekday][dayTime]
      return prevSchedule;
    },
    createSchedule : (prevSchedule, action : PayloadAction<dayTimes[]>) => {
      return action.payload;
    }
  },
})

export default scheduleSlice.reducer
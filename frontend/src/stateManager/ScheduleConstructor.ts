import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface dayTimes {
    morning : boolean,
    noon : boolean,
    evening : boolean
};

const initialState: dayTimes[] = [
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    },
    {
        morning : false,
        noon : false,
        evening : false
    }
];

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    changeSchedule: (prevSchedule, action : PayloadAction<{
        weekday : number,
        dayTimes : string[]
    }>) => {
      const newSchedule = [...prevSchedule];
      const {weekday, dayTimes} = action.payload;

      newSchedule[weekday] = {
        morning : false,
        noon : false,
        evening : false
      }

      dayTimes.forEach(daytime=>{newSchedule[weekday][daytime] = true});
      return newSchedule;
    },
    createSchedule : (prevSchedule, action : PayloadAction<dayTimes[]>) => {
      return { ...action.payload };
    }
  },
})

export default scheduleSlice.reducer
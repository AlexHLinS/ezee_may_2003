import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { scheduleSlice } from '../stateManager/ScheduleConstructor';

interface ActivityCategory {
    id : number,
    picture : string,
    title : string,
    description : string,
    season : string,
    tags : string[]
};

const initialState: ActivityCategory[] = [
    // {
    //     id : 0,
    //     picture : '',
    //     title : 'Скандинавская ходьба',
    //     description : "Ходьба с палками, вид физической активности, в которой используются определенная методика занятия и техника ходьбы при помощи специально разработанных палок",
    //     season : "Круглый год",
    //     tags : ["Помещение", "Групповые", "Новое"]
    // },
    // {
    //     id : 1,
    //     picture : '',
    //     title : 'Скандинавская ходьба',
    //     description : "Ходьба с палками, вид физической активности, в которой используются определенная методика занятия и техника ходьбы при помощи специально разработанных палок",
    //     season : "Круглый год",
    //     tags : ["Помещение", "Групповые", "Новое"]
    // }
];

export const ActivityCategorySlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setActivityCategories: (__, action : PayloadAction<ActivityCategory[]>) => {
      return action.payload;
    }
  },
});

export default ActivityCategorySlice.reducer;
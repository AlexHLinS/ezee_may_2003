import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
  id: number,
  picture: string,
  categories : string[],
  title: string,
  description : string,
  location: {
    address: string,
    latitude: string,
    longitude: string,
    distance: string,
    isNear : boolean,
    estimatedTime : number
  },
  schedule: string
};

const initialState: Activity[] = [
  //   {
  //       id : 0,
  //       picture : "",
  //       title : 'Скандинавская ходьба 1',
  //       categories: ['1', '2', '3'],
  //       description : "Ходьба с палками, вид физической активности, в которой используются определенная методика занятия и техника ходьбы при помощи специально разработанных палок",
  //       location : {
  //         address : 'ул. Скворцова, 5',
  //         latitude : '55.96',
  //         longitude : '37.68',
  //         distance : '5 km',
  //         isNear : true,
  //         estimatedTime : 30,
  //       },
  //       schedule : "c 01.01.2023 по 28.02.2023, Чт. 12:00-14:00, без перерыва; c 01.09.2022 по 31.12.2022, Чт. 12:00-14:00"
  //   },
  //   {
  //     id : 1,
  //     picture : "",
  //     title : 'Скандинавская ходьба 2',
  //     categories: ['1', '2', '3'],
  //     description : "Ходьба с палками, вид физической активности, в которой используются определенная методика занятия и техника ходьбы при помощи специально разработанных палок",
  //     location : {
  //       address : 'ул. Скворцова, 5',
  //       latitude : '55.34',
  //       longitude : '37.23',
  //       distance : '5 km',
  //       isNear : true,
  //       estimatedTime : 45,
  //     },
  //     schedule : "c 01.01.2023 по 28.02.2023, Чт. 12:00-14:00, без перерыва; c 01.09.2022 по 31.12.2022, Чт. 12:00-14:00"
  // },
];

export const ActivitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivities: (__, action : PayloadAction<Activity[]>) => {
      return action.payload;
    }
  },
});

export default ActivitySlice.reducer;
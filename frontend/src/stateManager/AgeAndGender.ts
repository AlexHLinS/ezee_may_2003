import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AgeGender {
  age : number,
  gender : number
};

const initialState: AgeGender = {};

export const AgeGenderSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setAgeGender: (__, action : PayloadAction<AgeGender>) => {
      return action.payload;
    }
  },
});

export default AgeGenderSlice.reducer;
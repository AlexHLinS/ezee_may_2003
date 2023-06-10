import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface selectedСharacterInterface {
  "id"?: number,
  "label"? : string,
  "year"? : string,
  "age"? : number,
  "gender"? : number
}

const initialState: selectedСharacterInterface = {};

export const selectedCharacterSlice = createSlice({
  name: 'selectedCharacterSlice',
  initialState,
  reducers: {
    selectedCharacterResolver: (__, action : PayloadAction<selectedСharacterInterface>) => {
      return action.payload;
    }
  },
})

export default selectedCharacterSlice.reducer
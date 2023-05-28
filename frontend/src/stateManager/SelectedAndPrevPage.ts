import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface selectedAndPrevPages {
  selectedPageIndex: number
  prevPageIndex: number
}

const initialState: selectedAndPrevPages = {
  selectedPageIndex: 0,
  prevPageIndex: -1
}

export const selectedAndPrevPagesSlice = createSlice({
  name: 'selectedAndPrevPages',
  initialState,
  reducers: {
    selectedAndPrevPageResolver: (prevState, action : PayloadAction<number>) => {
      return {
        selectedPageIndex : action.payload,
        prevPageIndex : prevState.selectedPageIndex
      }
    }
  },
})

export default selectedAndPrevPagesSlice.reducer
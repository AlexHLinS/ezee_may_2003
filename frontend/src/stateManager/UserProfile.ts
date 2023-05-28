import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  userId : number
};

const initialState: UserProfile = {
  userId : -1
};

export const UserProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserProfile: (__, action : PayloadAction<number>) => {
      return {userId : action.payload};
    }
  },
});

export default UserProfileSlice.reducer;
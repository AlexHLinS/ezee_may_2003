import { configureStore, combineReducers } from '@reduxjs/toolkit';
import selectedAndPrevPageReducer from './SelectedAndPrevPage';
import scheduleReducer from './ScheduleConstructor';
import maxTripTimeReducer from './MaxTripTime';
import ActivityCategoriesReducer from './ActivityCategories';
import ActivityReducer from './Activities';
import ActivitiesMapReducer from './ActivitiesMap';
import SelectedActivityReducer from './SelectedActivity';
import BookingReducer from './Bookings';
import UserProfileReducer from './UserProfile';

const rootReducer = combineReducers({
    selectedAndPrevPageReducer,
    scheduleReducer,
    maxTripTimeReducer,
    ActivityCategoriesReducer,
    ActivityReducer,
    ActivitiesMapReducer,
    SelectedActivityReducer,
    BookingReducer,
    UserProfileReducer
})

const store = configureStore({
    reducer : rootReducer
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store;
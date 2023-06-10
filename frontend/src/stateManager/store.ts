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
import AnswerReducer from './Answers';
import RecommendationReducer from './Recommendations';
import SelectedCharacterReducer from './SelectedСharacter';
import DisplayNUmberReducer from './displayOnboardingNumber';
import MainTabReducer from './mainTab';
import GigachatAnswerReducer from './gigachatAnswers';
import GigachatQuestionReducer from './gigachatQuestions';
import HistoryReducer from './HistoryGPT';
import AgeGenderReducer from './AgeAndGender';

const rootReducer = combineReducers({
    selectedAndPrevPageReducer,
    scheduleReducer,
    maxTripTimeReducer,
    ActivityCategoriesReducer,
    ActivityReducer,
    ActivitiesMapReducer,
    SelectedActivityReducer,
    BookingReducer,
    UserProfileReducer,
    AnswerReducer,
    RecommendationReducer,
    SelectedCharacterReducer,
    DisplayNUmberReducer,
    MainTabReducer,
    GigachatQuestionReducer,
    GigachatAnswerReducer,
    HistoryReducer,
    AgeGenderReducer
})

const store = configureStore({
    reducer : rootReducer
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store;
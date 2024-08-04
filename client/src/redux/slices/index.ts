import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import UserState

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

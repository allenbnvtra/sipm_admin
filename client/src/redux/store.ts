import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: import.meta.env.VITE_ENV !== 'production',
});

// You can also export types if needed
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

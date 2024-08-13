import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/setSocketConnection'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socketConnection'],
        // Ignore these paths in the state
        ignoredPaths: ['user.socketConnection'],
      },
    }),
  devTools: import.meta.env.VITE_ENV !== 'production',
});

// You can also export types if needed
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

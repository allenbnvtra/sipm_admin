import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  token: string | null;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
}

const initialState: UserState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || '{}') || {
    id: null,
    name: null,
    email: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        user: { id: string; name: string; email: string };
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = { id: null, name: null, email: null };

      // Clear from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setAuth, logout } = userSlice.actions;
export default userSlice.reducer;

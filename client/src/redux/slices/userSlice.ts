import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

export interface UserState {
  token: string | null;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
  socketConnection: Socket | null;
}

const initialState: UserState = {
  token: localStorage.getItem('token') || null,
  user: {
    id: null,
    name: null,
    email: null,
  },
  socketConnection: null,
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
    },

    setSocketConnection: (state, action: PayloadAction<Socket>) => {
      state.socketConnection =
        action.payload as unknown as typeof state.socketConnection;
    },

    logout: (state) => {
      state.token = null;
      state.user = { id: null, name: null, email: null };
      state.socketConnection = null;

      // Clear from localStorage
      localStorage.removeItem('token');
    },
  },
});

export const { setAuth, setSocketConnection, logout } = userSlice.actions;
export default userSlice.reducer;

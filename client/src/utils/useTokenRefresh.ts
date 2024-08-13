import { useAppDispatch } from '../redux/hooks';
import { logout, setAuth } from '../redux/slices/userSlice';
import axios from 'axios';

export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();

  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        '/refresh/',
        {},
        { withCredentials: true }
      );

      dispatch(
        setAuth({
          token: data.accessToken,
          user: JSON.parse(localStorage.getItem('user') || '{}'),
        })
      );

      return data.accessToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      dispatch(logout());
      window.location.href = '/login';
    }
  };

  return { refreshToken };
};

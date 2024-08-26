import axios from 'axios';
import { store } from '../redux/store';
import { logout, setAuth } from '../redux/slices/userSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
  timeout: 20000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    store.dispatch(logout());
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const resp = await axiosInstance.post('/v1/refresh');
    return resp.data;
  } catch (e) {
    store.dispatch(logout());
    return Promise.reject(e);
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const resp = await refreshToken();

        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Dispatch action to update token in Redux store
        store.dispatch(
          setAuth({
            token: resp.accessToken,
            user,
          })
        );

        const access_token = resp.accessToken;

        localStorage.setItem('token', access_token);
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle token refresh error
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const resp = await refreshToken();

        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Update token in Redux store
        store.dispatch(
          setAuth({
            token: resp.accessToken,
            user,
          })
        );

        const access_token = resp.accessToken;

        localStorage.setItem('token', access_token);
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Optionally log out user or redirect to login
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

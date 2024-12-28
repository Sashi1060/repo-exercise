import axios from "axios";
import store from "../../redux/store"; // Import your Redux store
import { setTokens, logout } from "../../redux/authSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_USERS_URI;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add Request Interceptor (Attach Access Token)
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add Response Interceptor (Handle Token Refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      try {
        const response = await axios.post(`${BASE_URL}/users/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Update access token in Redux
        store.dispatch(setTokens({ accessToken: access_token, refreshToken }));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";
import store from "../../redux/store";
import { setTokens, setUser, logout } from "../../redux/authSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_USERS_URI;

// export const handleLogin = async (email, password) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/users/login`, { email, password });

//     const { access_token, refresh_token, username, email: userEmail, admission_number } =
//       response.data;

//     // Dispatch tokens and user info to Redux
//     store.dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
//     store.dispatch(setUser({ username, email: userEmail, admissionNumber: admission_number }));

//     return response.data;
//   } catch (error) {
//     console.error("Login failed:", error.response?.data?.detail || error.message);
//     throw new Error(error.response?.data?.detail || "Login failed");
//   }
// };

export const handleLogin = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, { email, password });

    const { access_token, refresh_token, username, email: userEmail, admission_number } =
      response.data;

    // Dispatch tokens and user info to Redux
    store.dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token }));
    store.dispatch(setUser({ username, email: userEmail, admissionNumber: admission_number }));

    // Persist tokens in localStorage
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};


export const handleRegister = async (username, email, admissionNumber, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/create`, {
      username,
      email,
      admission_number: admissionNumber,
      password,
    });

    return response.data; // Registration doesn't include tokens
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

export const handleLogout = () => {
  store.dispatch(logout());
};

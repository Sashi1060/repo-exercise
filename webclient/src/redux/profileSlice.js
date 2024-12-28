import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_PROFILES_URI;

// Async Thunks

// Fetch Profile
// export const fetchProfile = createAsyncThunk(
//   "profile/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
//       const response = await axios.get(`${BASE_URL}/profiles`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data; // Return profile data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch profile.");
//     }
//   }
// );

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
      const token = localStorage.getItem("accessToken");
      console.log("Attempting to fetch profile with token:", token);
  
      try {
        const response = await axios.get(`${BASE_URL}/profiles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile fetch response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error.response || error.message);
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch profile."
        );
      }
    }
  );
  

// Create Profile
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${BASE_URL}/profiles`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return created profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create profile.");
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(`${BASE_URL}/profiles`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return updated profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile.");
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    resetProfile(state) {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Create Profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;

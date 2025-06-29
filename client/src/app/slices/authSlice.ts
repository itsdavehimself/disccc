import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const response = await fetch(`${apiUrl}/api/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Unauthorized");
  return await response.json();
});

interface AuthState {
  user: {
    email: string;
    username: string;
    firstSignIn: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = "Unauthorized";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

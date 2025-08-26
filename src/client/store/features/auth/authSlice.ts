import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  // other user properties
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Function to safely get initial state from localStorage (runs client-side)
const getInitialAuthState = (): AuthState => {
  let isAuthenticated = false;
  // Add logic here later if you store token/user in localStorage too
  if (typeof window !== "undefined") {
    // Check the simple flag initially
    isAuthenticated = localStorage.getItem("isAuthenticatedFlag") === "true";
  }
  return {
    isAuthenticated,
    user: null,
    token: null, // Should ideally get token from secure storage if persisted
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      // Set the simple flag in localStorage on successful login
      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticatedFlag", "true");
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
      // Clear the flag on failure
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticatedFlag");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Clear the flag on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticatedFlag");
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    // Add other reducers like register, updateProfile etc.
  },
});

export const { setLoading, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions;

export default authSlice.reducer;

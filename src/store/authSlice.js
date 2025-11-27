import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userData: null, // Add this for serializable user data
    isAuthenticated: false,
    userType: null,
    isLoading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      
      // Extract serializable user data
      if (action.payload) {
        state.userData = {
          uid: action.payload.uid,
          email: action.payload.email,
          emailVerified: action.payload.emailVerified,
          displayName: action.payload.displayName,
        };
      } else {
        state.userData = null;
      }
      
      state.isAuthenticated = !!action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userData = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
  },
});

export const { setUser, setUserType, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
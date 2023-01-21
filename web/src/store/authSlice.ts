import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { LoginFormValues } from './../components/modules/auth/LoginForm/LoginForm';
import { fetchLoggedInUser, registerUser, loginUser, signOutLoggedInUser, getFriends } from '../utils/api';

export interface UserDocument {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  user: UserDocument | null;
  friends: UserDocument[];
}

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  user: null,
  friends: [],
}

export const fetchLoggedInUserThunk = createAsyncThunk("auth/me", async () => fetchLoggedInUser());
export const fetchFriendsThunk = createAsyncThunk("users/friends", async (query: string) => getFriends(query));
export const signOutLoggedInUserThunk = createAsyncThunk("auth/signOut", async () => signOutLoggedInUser());
export const registerUserThunk = createAsyncThunk("auth/register", async (values: RegisterFormValues) => registerUser(values));
export const loginUserThunk = createAsyncThunk("auth/login", async (values: LoginFormValues) => loginUser(values));
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(registerUserThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(registerUserThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data.result;
      }
    })
    .addCase(registerUserThunk.rejected, (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
    })
    .addCase(fetchLoggedInUserThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchLoggedInUserThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data.result;
      }
    })
    .addCase(fetchLoggedInUserThunk.rejected, (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
    })
    .addCase(loginUserThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUserThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data.result;
      }
    })
    .addCase(loginUserThunk.rejected, (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
    })
    .addCase(signOutLoggedInUserThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(signOutLoggedInUserThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
      }
    })
    .addCase(signOutLoggedInUserThunk.rejected, (state) => {
      state.loading = false;
    })
    // Search Users
    .addCase(fetchFriendsThunk.fulfilled, (state, action) => {
      if (action.payload.data.success) {
        state.loading = false;
        state.friends = action.payload.data.result;
      }
    })
})

export const {} = authSlice.actions
export default authSlice.reducer;
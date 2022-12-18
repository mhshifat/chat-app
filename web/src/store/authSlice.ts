import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RegisterFormValues } from './../components/modules/auth/RegisterForm/RegisterForm';
import { fetchLoggedInUser, registerUser } from '../utils/api';

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
}

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  user: null,
}

export const fetchLoggedInUserThunk = createAsyncThunk("auth/me", async () => fetchLoggedInUser());
export const registerUserThunk = createAsyncThunk("auth/register", async (values: RegisterFormValues) => registerUser(values));
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
})

export const {} = authSlice.actions
export default authSlice.reducer;
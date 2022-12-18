import axios from "axios";
import { RegisterFormValues } from "../components/modules/auth/RegisterForm/RegisterForm";
import { LoginFormValues } from "../components/modules/auth/LoginForm/LoginForm";
import { UserDocument } from "../store/authSlice";

const { REACT_APP_API_SERVER } = process.env;
export const httpClient = axios.create({
  baseURL: `http://${REACT_APP_API_SERVER}:8000`,
  withCredentials: true
});

export interface HttpResponse<T> {
  success: boolean;
  result: T
};

// Auth APIS
export const fetchLoggedInUser = () => httpClient
  .get<HttpResponse<UserDocument | null>>("/api/users/me");
export const signOutLoggedInUser = () => httpClient
  .delete<HttpResponse<UserDocument | null>>("/api/users/me");
export const registerUser = (values: RegisterFormValues) => httpClient
  .post<HttpResponse<UserDocument>>("/api/users/register", values);
export const loginUser = (values: LoginFormValues) => httpClient
  .post<HttpResponse<UserDocument>>("/api/users/login", values);
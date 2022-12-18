import { lazy } from "react";

export const LoginPage = lazy(() => import("./Login"));
export const RegisterPage = lazy(() => import("./Register"));
export const DashboardPage = lazy(() => import("./Dashboard"));
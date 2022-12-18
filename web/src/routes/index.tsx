import { BrowserRouter, Route, Routes as DomRoutes } from "react-router-dom";
import { LoginPage, RegisterPage } from "../pages";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchLoggedInUserThunk } from "../store/authSlice";
import ProtectedRoute from "./ProtectedRoute";

export default function Routes() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLoggedInUserThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <DomRoutes>
          <Route path="/">
            <Route index element={(
              <ProtectedRoute type="public">
                <LoginPage />
              </ProtectedRoute>
            )} />
            <Route path="/register" element={(
              <ProtectedRoute type="public">
                <RegisterPage />
              </ProtectedRoute>
            )} />
          </Route>
        </DomRoutes>
      </Suspense>
    </BrowserRouter>
  )
}
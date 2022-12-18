import { BrowserRouter, Route, Routes as DomRoutes } from "react-router-dom";
import { RegisterPage } from "../pages";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchLoggedInUserThunk } from "../store/authSlice";

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
            <Route index element={<p>Welcome</p>} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </DomRoutes>
      </Suspense>
    </BrowserRouter>
  )
}
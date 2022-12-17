import { BrowserRouter, Route, Routes as DomRoutes } from "react-router-dom";
import { RegisterPage } from "../pages";
import { Suspense } from "react";

export default function Routes() {
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
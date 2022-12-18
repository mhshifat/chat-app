import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from "../store";
import { PropsWithChildren } from 'react';

interface ProtectedRouteProps {
  type?: "public" | "private"
}

export default function ProtectedRoute({ type = 'private', children }: PropsWithChildren<ProtectedRouteProps>) {
  const { loading, isLoggedIn, user } = useSelector((state: AppState) => state.authSlice);
  
  if (loading) return <p>Loading...</p>;
  if (type === "public" && isLoggedIn && user?.id) {
    return <Navigate to="/dashboard" replace />;
  }
  if (type === "private" && !isLoggedIn && !user?.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children ? children : <Outlet />}
    </>
  );
}
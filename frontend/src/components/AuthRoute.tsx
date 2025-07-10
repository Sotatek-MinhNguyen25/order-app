import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../libs/auth';

interface AuthRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: AuthRouteProps) => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: AuthRouteProps) => {
  const isAuth = isAuthenticated();
  const location = useLocation();
  const from = location.state?.from || '/orders';

  if (isAuth) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

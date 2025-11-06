import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // First check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const userRoles = user.roles || [];
  const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role.name));

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user's primary role
    const primaryRole = userRoles[0]?.name?.toLowerCase();
    if (primaryRole === 'buyer') {
      return <Navigate to="/homebuyer" replace />;
    } else if (primaryRole === 'investor') {
      return <Navigate to="/investor" replace />;
    }
    // Default redirect if no role matches
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;


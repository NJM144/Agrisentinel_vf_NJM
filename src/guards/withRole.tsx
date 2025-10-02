import React from 'react';
import { Navigate } from 'react-router-dom';

export type UserRole = 'planteur' | 'coop' | 'etat' | 'ong' | 'cert';

interface WithRoleProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  userRole?: UserRole | null;
  fallbackPath?: string;
}

export const WithRole: React.FC<WithRoleProps> = ({
  children,
  allowedRoles,
  userRole,
  fallbackPath = '/auth'
}) => {
  if (!userRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
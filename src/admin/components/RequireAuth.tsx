import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminAuthed } from '../auth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!isAdminAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

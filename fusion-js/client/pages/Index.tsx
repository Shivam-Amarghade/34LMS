import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

export default function Index() {
  const { user } = useAppSelector(state => state.auth);

  // If authenticated, redirect to appropriate portal dashboard
  if (user) {
    const portalMap: Record<string, string> = {
      EMPLOYEE: '/employee/dashboard',
      SUPERVISOR: '/supervisor/dashboard',
      LD_LEAD: '/admin/dashboard',
      ADMIN: '/admin/dashboard',
    };

    const path = user && portalMap[user as unknown as keyof typeof portalMap];
    if (path) {
      return <Navigate to={path} replace />;
    }
  }

  // Otherwise, redirect to login
  return <Navigate to="/login" replace />;
}

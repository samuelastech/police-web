import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface Props {
  allowedRoles: string[];
}

export default function RequireAuth({ allowedRoles }: Props) {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.type && allowedRoles?.includes(auth?.type)
      ? <Outlet />
      : auth.email
        ? <Navigate
            to='/unauthorized'
            state={{ from: location }}
            replace />
        : <Navigate
            to='/login'
            state={{ from: location }}
            replace />
  );
}

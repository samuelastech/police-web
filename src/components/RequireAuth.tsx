import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/';

interface Props {
  allowedRoles: string[];
}

export default function RequireAuth({ allowedRoles }: Props) {
  const { auth } = useAuth();

  return (
    auth?.type && allowedRoles?.includes(auth?.type)
      ? <Outlet />
      : <Navigate
            to='/'
            replace />
  );
}

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  useEffect(() => {
    if (pathname === '/') {
      navigate('/login', { replace: true });
    }
  });


  return (
    <main>
      <Outlet />
    </main>
  );
}
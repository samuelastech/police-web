import { useEffect, useState } from 'react';
import useRefresh from '../hooks/useRefresh';
import useAuth from '../hooks/useAuth';
import { Outlet } from 'react-router-dom';

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false
    };
  }, []);
  
  return (
    <>
      {
        !persist 
          ? <Outlet />
          : isLoading
            ? <p>Loading...</p>
            : <Outlet />
      }
    </>
  );
}

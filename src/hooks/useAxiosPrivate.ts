import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefresh from './useRefresh';
import useAuth from './useAuth';

export default function useAxiosPrivate() {
  const refresh = useRefresh();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate
    .interceptors
      .request
      .use((config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      }, (error) => Promise.reject(error));
      
      const responseIntercept = axiosPrivate
      .interceptors
      .response
      .use((response) => response, async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAcessToken = await refresh();
          console.log(`Bearer ${newAcessToken}`)
          prevRequest.headers['Authorization'] = `Bearer ${newAcessToken}`;
          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      });
    
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    };
  }, [auth, refresh]);
  return axiosPrivate;
}
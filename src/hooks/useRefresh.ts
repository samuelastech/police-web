import axios from '../api/axios';
import useAuth from './useAuth';

export default function useRefresh() {
  const { setAuth } = useAuth();

  async function refresh() {
    const response = await axios.get('/auth/refresh', {
      withCredentials: true,
    });
    
    const { accessToken, type } = response.data;
    setAuth((previous: any) => {
      return { ...previous, accessToken, type };
    });

    return accessToken;
  }
  return refresh;
}
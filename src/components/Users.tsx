import { useState, useEffect, useRef } from 'react';
import { useAxiosPrivate } from '../hooks/';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users', {
          signal: controller.signal
        });

        isMounted && setUsers(response.data);
      } catch (error) {
        console.log(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    }
    
    if (effectRun.current) {
      getUsers();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, []);

  return (
    <article>
      <h2>Users list</h2>
      {
        users?.length ? (
          <ul>
            {
              users.map((user, i) => <li key={i}>{user?.name}</li>)
            }
          </ul>
        ) : (
          <p>No users</p>
        )
      }
    </article>
  );
}

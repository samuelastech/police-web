import { useState, useEffect } from 'react';
import axios from '../api/axios';

interface User {
  name: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axios.get('/users', {
          signal: controller.signal
        });

        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
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

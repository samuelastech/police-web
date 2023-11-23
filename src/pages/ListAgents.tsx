import '../styles/pages/list-agents.css';
import { axiosPrivate } from '../api/axios';
import { useEffect, useRef, useState } from 'react';
import { Roles } from '../types/users.type';
import { Trash } from '@phosphor-icons/react';

export const ListAgents = () => {
  const [users, setUsers] = useState([]);
  const usersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fecthUsers();
  }, []);

  const fecthUsers = async () => {
    const response = await axiosPrivate.get('/users');
    if (response.data && response.data.length) {
      setUsers(response.data);
    }
  };

  const deleteUser = async (userId: string) => {
    await axiosPrivate.delete(`/users/${userId}`);

    if (usersRef.current) {
      const children = usersRef.current.children;
      for (let i = 0; i  < usersRef.current.children.length; i++) {
        const id = children[i].getAttribute('data-id');
        if (userId === id) {
          children[i].remove();
          break;
        }
      }
    }
  }

  return (
    <div className='table-agents' ref={usersRef}>
      <div className='row-header'>
        <div className='cell'>Identificador</div>
        <div className='cell'>Nome</div>
        <div className='cell'>Email</div>
        <div className='cell -small'>Tipo</div>
        <div className='cell -small'></div>
      </div>
      {
        users.length ? (
          users.map((user: any) => (
            <div className='row-body' key={user.id} data-id={user.id} >
              <div className='cell'>{user.id}</div>
              <div className='cell'>{user.name}</div>
              <div className='cell'>{user.email}</div>
              <div className='cell -small'>{
                user.type === Roles.POLICE
                  ? 'Policial' : Roles.OPERATOR
                  ? 'Operador' : 'Manager'
              }</div>
              <div className='cell -small' onClick={() => deleteUser(user.id)}>
                <div className='delete-button'>
                  <Trash color='white' />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='row-body'>
            <div>Nenhum usuário...</div>
          </div>
        )
      }
    </div>
  );
};

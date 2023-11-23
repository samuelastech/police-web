import '../styles/pages/create-squads.css';
import { FormEvent, useEffect, useState } from 'react';
import { Users, WarningCircle } from '@phosphor-icons/react';
import { Button, Callout, InputLighter, Modal } from '../components';
import { axiosPrivate } from '../api/axios';

interface User {
  id: string;
  name: string;
}

export const CreateSquads = () => {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [createdModal, setCreatedModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [groupName, selectedUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetValues = () => {
    setGroupName('');
    setSelectedUsers([]);
  };

  const changeUser = (event: any) => {
    setSelectedUsers((users: string[]) => {
      if (!users.includes(event.target.value as never)) {
        return [...users, event.target.value];
      } else {
        return users.filter((id) => id !== event.target.value);
      }
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosPrivate.get('/users/nosquad');
      setUsers(response.data);
    } catch (error: any) {
      console.log(error);
      setError(error.message)
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosPrivate.post('/squad', JSON.stringify({
        name: groupName,
        polices: selectedUsers,
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      setCreatedModal(true);
      resetValues();
      await fetchUsers();
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Modal
        text='Grupo criado com sucesso'
        buttonText='Ok'
        action={() => setCreatedModal(false)}
        isOpen={createdModal}
        setIsOpen={setCreatedModal} />
      <fieldset className='form-squads'>
        <legend className='title'>Criar um <i>Squad</i></legend>
        <InputLighter
          label='Nome do grupo'
          name='name'
          placeholder='Digite o nome do grupo'
          icon={Users}
          setProperty={setGroupName}
          type='text'
          value={groupName}
          required />
        
        <div className='select-container'>
          <label className='label'>Selecione usuários sem grupo</label>
          <select className='select' name='type' defaultValue='' multiple={true} onChange={changeUser}>
            {users.length ? users.map((user: User) => <option value={user.id}>{user.name}</option>) : null}
          </select>
        </div>
        <div className='selected-users'>
          <p className='title'>Usuários selecionados:</p>
          <div className='users-container'>
            {
              selectedUsers.length ? selectedUsers.map((user) => {
                return <p className='user'>{(users.filter((agent) => agent.id === user)[0].name)}</p>;
              }) : null
            }
          </div>
        </div>
        <div>
          <Button text='Criar grupo' />
        </div>
      </fieldset>
      {error ? <Callout text={error} icon={WarningCircle} /> : null}
    </form>
  );
};
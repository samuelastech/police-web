import '../styles/pages/list-agents.css';
import '../styles/pages/list-squads.css';
import { axiosPrivate } from '../api/axios';
import { useEffect, useRef, useState } from 'react';
import { Trash } from '@phosphor-icons/react';

export const ListSquads = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [fetchedGroup, setFetchedGroup] = useState<any>({});
  const [fetchedPolices, setFetchedPolices] = useState<any>([]);
  const [fetchedNoSquadPolices, setFetchedNoSquadPolices] = useState<any>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const policesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroup(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    const response = await axiosPrivate.get('/squad');
    if (response.data && response.data.length) {
      setGroups(response.data);
    }
  };

  const fetchGroup = async (groupId: string) => {
    const response = await axiosPrivate.get(`/squad/${groupId}`);
    if (response.data) {
      setFetchedGroup(response.data);
      fetchPolices(response.data.polices);
    }
  };

  const fetchPolices = async (polices: string[]) => {
    setFetchedPolices([]);
    setFetchedNoSquadPolices([]);
    for (const police of polices) {
      try {
        const response = await axiosPrivate.get(`/users/${police}`);
        setFetchedPolices((polices: any) => {
          return [...polices, response.data];
        });
      } catch (error: any) {
        if (error.response.status === 404) {
          console.log('Police not found')
        }
      }
    }

    fetchNoSquadPolices();
  };

  const fetchNoSquadPolices = async () => {
    setFetchedNoSquadPolices([]);
    const response = await axiosPrivate.get('/users/nosquad');
    setFetchedNoSquadPolices(response.data);
  };

  const selectGroup = (event: any) => {
    setSelectedGroup(event.target.value);
  }

  const changeUser = (event: any) => {
    setSelectedUsers((users: string[]) => {
      if (!selectedUsers.includes(event.target.value as never)) {
        return [...users, event.target.value];
      } else {
        return selectedUsers.filter((id) => id !== event.target.value);
      }
    });
  };

  const addUserToGroup = async () => {
    for (const police of selectedUsers) {
      await axiosPrivate.post(`/squad/${selectedGroup}/police/${police}`);
    }

    setSelectedUsers([]);
    fetchGroup(selectedGroup);
  };

  const removeFromGroup = async (userId: string) => {
    await axiosPrivate.delete(`/squad/${selectedGroup}/police/${userId}`);

    if (policesRef.current) {
      const children = policesRef.current.children;
      for (let i = 0; i  < policesRef.current.children.length; i++) {
        const id = children[i].getAttribute('data-id');
        if (userId === id) {
          children[i].remove();
          break;
        }
      }
    }
  }

  return (
    <>
      <p className='select-title'>Selecione um grupo:</p>
      <select className='select-groups' onClick={selectGroup}>
        {
          groups.length ? groups.map((group: any) => {
            return <option value={group._id}>{group.name}</option>
          }) : null
        }
      </select>
      {
        Object.keys(fetchedGroup).length ? (
          <div className='table-agents'>
            <div className='row-header'>
              <div className='cell -small'>Identificador</div>
              <div className='cell'>Nome do squad</div>
            </div>
             <div className='row-body' key={fetchedGroup._id} data-id={fetchedGroup._id} >
              <div className='cell -small'>{fetchedGroup._id}</div>
              <div className='cell'>{fetchedGroup.name}</div>
            </div>
          </div>
        ) : null
      }

      {
        fetchedPolices.length ? (
          <div>
            <div className='table-agents' ref={policesRef}>
              <div className='row-header'>  
                <div className='cell -small'>Identificador</div>
                <div className='cell'>Policial</div>
              </div>
              {
                fetchedPolices.map((police: any) => (
                  <div className='row-body' key={police.id} data-id={police.id} >
                    <div className='cell -small'>{police.id}</div>
                    <div className='cell'>{police.name}</div>
                    <div className='cell -small' onClick={() => removeFromGroup(police.id)}>
                      <div className='delete-button'>
                        <Trash color='white' />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            {
              fetchedNoSquadPolices.length ? (
                <>
                  <div className='table-actions'>
                    <div className='select'>
                      <p className='title'>Selecione usuários:</p>
                      <select className='container' multiple={true} onChange={changeUser}>
                        {fetchedNoSquadPolices.map((police: any) => {
                          return <option value={police.id}>{police.name}</option>
                        })}
                      </select>
                    </div>
                    <div className='selected'>
                      <p className='title'>Usuários selecionados:</p>
                      <div className='users-container'>
                        {
                          selectedUsers.length ? selectedUsers.map((user) => {
                            return <p className='user'>{user}</p>;
                          }) : null
                        }
                      </div>
                    </div>
                  </div>
                  <button className='button-add' onClick={addUserToGroup}>Adicionar</button>
                </>
              ) : null
            }
          </div>
        ) : null
      } 
    </>
  );
};

import '../styles/pages/admin.css';
import '../styles/components/button-logout.css';
import { useState } from 'react';
import { SignOut } from '@phosphor-icons/react';
import { CreateAgents } from './CreateAgents';
import { CreateSquads } from './CreateSquads';
import { ListAgents } from './ListAgents';
import { ListSquads } from './ListSquads';
import { useLogout } from '../hooks';
import { useNavigate } from 'react-router-dom';

enum Pages {
  CREATE_AGENTS = 'create-agent',
  CREATE_SQUADS = 'create-squads',
  LIST_AGENTS = 'list-agents',
  LIST_SQUADS = 'list-squads'
}

export const AdminDashboard = () => {
  const [page, setPage] = useState(Pages.CREATE_AGENTS);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div id='admin-page'>
      <aside className='left-container'>
        <p className='title'>Menu</p>
        <div className='menubutton' onClick={() => setPage(Pages.CREATE_AGENTS)}>Criar agentes</div>
        <div className='menubutton' onClick={() => setPage(Pages.CREATE_SQUADS)}>Criar squads</div>
        <div className='menubutton' onClick={() => setPage(Pages.LIST_AGENTS)}>Lista de agentes</div>
        <div className='menubutton' onClick={() => setPage(Pages.LIST_SQUADS)}>Lista de squads</div>
      </aside>
      <section className='section-container'>
        <h1 className='title'>Dashboard <span className='subtitle'>Gestão</span></h1>
        {page === Pages.CREATE_AGENTS
          ? <CreateAgents />
          : page === Pages.CREATE_SQUADS ? <CreateSquads />
          : page === Pages.LIST_AGENTS ? <ListAgents />
          : page === Pages.LIST_SQUADS ? <ListSquads />
          : null
        }
      </section>
      <aside className='right-container'>
        <div className='infos-header'>
          <span className='email'>samuel.araujo.souza@outlook.com
            <button className='button-logout' onClick={handleLogout}>
              <SignOut size={25} color='#fff' />
            </button>
          </span>
          <span className='role'>Gerente</span>
        </div>
      </aside>
    </div>
  );
}
import '../styles/pages/create-agent.css';
import { axiosPrivate } from '../api/axios';
import { FormEvent, useEffect, useState } from 'react';
import { Button, Callout, InputLighter, Modal } from '../components';
import { User, LockSimple, Envelope, WarningCircle } from '@phosphor-icons/react';
import { Roles } from '../types/users.type';

export const CreateAgents = () => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState(Roles.POLICE);
  const [createdModal, setCreatedModal] = useState(false);

  useEffect(() => {
    setError('');
  }, [name, email, pass, type]);

  const types = [
    { label: 'Policial', value: Roles.POLICE },
    { label: 'Operador', value: Roles.OPERATOR },
    { label: 'Gestor', value: Roles.MANAGER },
  ];

  const changeType = (event: any) => setType(event.target.value);

  const resetValues = () => {
    setEmail('');
    setPass('');
    setType(Roles.POLICE);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axiosPrivate.post('/users', JSON.stringify({
        name,
        email,
        password: pass,
        type
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      
      setCreatedModal(true);
      resetValues();
    } catch (error: any) {
      if (!error?.response) {
        setError('Sem resposta do servidor');
      } else if(error.response?.status === 400) {
        setError('Algum campo foi esquecido');
      } else if(error.response?.status === 401) {
        setError('Você não está autorizado a cadastrar um usuário');
      } else {
        setError('O cadastro do agente falhou por algum motivo');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Modal
        text='Usuário criado com sucesso'
        buttonText='Ok'
        action={() => setCreatedModal(false)}
        isOpen={createdModal}
        setIsOpen={setCreatedModal} />

      <fieldset className='form-agents'>
        <legend className='title'>Criar agentes</legend>
        <div className='input-fields'>
          <InputLighter
            autoComplete='off'
            label='Nome'
            name='name'
            placeholder='Digite o nome do agente'
            icon={User}
            setProperty={setName}
            type='text'
            value={name}
            required />

          <InputLighter
            autoComplete='off'
            label='E-mail'
            name='email'
            placeholder='Digite o email do agente'
            icon={Envelope}
            setProperty={setEmail}
            type='email'
            value={email}
            required />
        </div>
        <div className='input-fields'>
          <InputLighter
            label='Senha'
            name='password'
            placeholder='Crie uma senha para o agente'
            icon={LockSimple}
            setProperty={setPass}
            type='password'
            value={pass}
            required />

          <div className='select-container'>
            <label className='label'>Tipo do usuário</label>
            <select name='type' defaultValue='police' className='select' onChange={changeType}>
              {types.map((type) => <option value={type.value}>{type.label}</option>)}
            </select>
          </div>
        </div>
        <div className='button-container'>
          <Button text='Cadastrar' />
        </div>
      </fieldset>

      {error ? <Callout text={error} icon={WarningCircle} /> : null}
    </form>
  );
}

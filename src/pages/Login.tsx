import '../styles/pages/login.css';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Roles } from '../types/users.type';
import { Envelope, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { Input, Button, Callout } from '../components';
import { useAuth } from '../hooks/';
import axios from '../api/axios';
const SIGN_IN_URL = '/auth/signin';

export const Login = () => {
  const { setAuth, setPersist, persist } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [email, pass]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(SIGN_IN_URL, JSON.stringify({
        email,
        password: pass,
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { accessToken, type, id } = response?.data;
      setAuth({ email, pass, accessToken, type, id });

      setEmail('');
      setPass('');
      navigate(type === Roles.OPERATOR ? '/dashboard' : '/', { replace: true });
    } catch (error: any) {
      console.log(error)
      if (!error?.response) {
        setErrorMessage('Sem resposta do servidor');
      } else if(error.response?.status === 400) {
        setErrorMessage('Esqueceu e-mail e/ou senha');
      } else if(error.response?.status === 401) {
        setErrorMessage('Acesso não autorizado');
      } else {
        setErrorMessage('O login falhou por algum motivo');
      }

      errorRef.current?.focus();
    }
  };

  const togglePersist = () => {
    setPersist((previous: any) => !previous);
  };

  useEffect(() => {
    localStorage.setItem('persist', `${persist}`);
  }, [persist]);
  
  return (
    <section className='login-page'>
      <form className='login-box' onSubmit={handleSubmit}>
        {errorMessage ? <Callout  ref={errorRef} text={errorMessage} icon={WarningCircle} /> : null}  
        <h1 className='title'>Entrar</h1>
        <Input
          icon={Envelope}
          type='email'
          label='E-mail'
          setProperty={setEmail}
          value={email}
          ref={emailRef}
          required
          autoComplete='off'
          placeholder='Digite seu e-mail' />

        <Input
          icon={LockSimple}
          type='password'
          label='Senha'
          setProperty={setPass}
          value={pass}
          required
          autoComplete='off'
          placeholder='Digite sua senha' />

        <Button text='Entrar' />

        <div className='checkbox-input'>
          <label htmlFor='persist'>Manter-se conectado neste dispositivo: </label>
          <input
            type='checkbox'
            id='persist'
            onChange={togglePersist}
            checked={persist} />
        </div>
      </form>
    </section>
  );
}

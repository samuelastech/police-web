import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
const SIGN_IN_URL = '/auth/signin';

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/login';

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

      const { token, type } = response?.data;
      setAuth({ email, pass, accessToken: token, type });

      setEmail('');
      setPass('');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.log(error)
      if (!error?.response) {
        setErrorMessage('No server response');
      } else if(error.response?.status === 400) {
        setErrorMessage('Missing email or password');
      } else if(error.response?.status === 401) {
        setErrorMessage('Unauthorized');
      } else {
        setErrorMessage('Login failed for some reason');
      }

      errorRef.current?.focus();
    }
  }
  
  return (
    <section>
      <p
        ref={errorRef}
        className={errorMessage ? 'errmsg' : 'offscreen'}
        aria-live='assertive'>
          {errorMessage}
      </p>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          ref={emailRef}
          autoComplete='off'
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          required />

        <label htmlFor='pass'>Password</label>
        <input
          type='password'
          id='pass'
          onChange={(event) => setPass(event.target.value)}
          value={pass}
          required />

        <button>Sing in</button>
      </form>
    </section>
  );
}

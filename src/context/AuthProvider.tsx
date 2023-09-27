import { ReactNode, createContext, useState } from 'react';

export interface AuthProps {
  email: string;
  pass: string;
  accessToken: string;
  type: string;
}

const AuthContext = createContext({
  auth: {} as Partial<AuthProps>,
  setAuth: (auth: any) => {},
  persist: false,
  setPersist: (persist: any) => {},
});

interface Props {
  children?: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [auth, setAuth] = useState({});
  const storedValue = localStorage.getItem('persist');
  const [persist, setPersist] = useState<boolean>(storedValue ? JSON.parse(storedValue) : false);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

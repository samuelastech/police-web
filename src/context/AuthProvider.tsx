import { ReactNode, createContext, useState } from 'react';

interface AuthProps {
  email: string;
  pass: string;
  accessToken: string;
  type: string;
}

const AuthContext = createContext({
  auth: {} as Partial<AuthProps>,
  setAuth: (auth: AuthProps) => {}
});

interface Props {
  children?: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

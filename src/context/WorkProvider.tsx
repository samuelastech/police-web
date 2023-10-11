import { ReactNode, createContext, useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import io, { Socket } from 'socket.io-client';
import { Outlet } from 'react-router-dom';

export interface WorkProps {
  socket: Socket;
}

const WorkContext = createContext({
  socket: {},
} as WorkProps);

interface Props {
  children?: ReactNode;
}

export function WorkProvider({ children }: Props) {
  console.log('Im inside the context')
  const { auth } = useAuth();
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_SOCKET_SERVER as string, {
        transportOptions: {
            polling: {
                extraHeaders: {
                    Authorization: auth.accessToken,
                }
            }
        }
    }).connect();
  }, []);

  return (
    <WorkContext.Provider value={{ socket }}>
      {children}
    </WorkContext.Provider>
  );
}

export function WorkLayout() {
  return (
    <WorkProvider>
      <Outlet />
    </WorkProvider>
  );
}

export default WorkContext;

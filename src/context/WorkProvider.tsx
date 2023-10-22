import { ReactNode, createContext, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/';
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
  }, [auth.accessToken]);

  useEffect(() => {
    socket.on('connect_error', (error) => {
      console.log(error);
    });
  }, [socket]);

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

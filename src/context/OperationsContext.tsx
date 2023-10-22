import 'leaflet/dist/leaflet.css'
import { Fragment, createContext, useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import { AgentsPosition } from '../types/users.type';
import { LatLngExpression } from 'leaflet';
import { PositionMarker } from '../components';
import { Outlet } from 'react-router-dom';
import { useWork } from '../hooks';

interface OperationsContextProps {
  agentsPosition: AgentsPosition;
  chaserPosition: AgentsPosition;
  supportPosition: AgentsPosition;
  chaserRoute: [[number, number]] | [];
  isSupporting: boolean;
  occurrenceId: string;
  setChaserRoute: (chaserRoute: any) => void;
  setAgentsPosition: (agent: any) => void;
  setChaserPosition: (agent: any) => void;
  setSupportPosition: (agent: any) => void;
  setIsSupporting: (isSupporting: boolean) => void;
  setOccurrenceId: (occurrenceId: string) => void;
}

export const OperationsContext = createContext({
  agentsPosition: {},
  chaserPosition: {},
  supportPosition: {},
  isSupporting: false,
  occurrenceId: '',
  chaserRoute: [],
  setChaserRoute: (chaserRoute: any) => {},
  setAgentsPosition: (agent: any) => {},
  setChaserPosition: (agent: any) => {},
  setSupportPosition: (agent: any) => {},
  setIsSupporting: (isSupporting: boolean) => {},
  setOccurrenceId: (occurrenceId: string) => {},
} as OperationsContextProps);

export const OperationsProvider = () => {
  const [chaserRoute, setChaserRoute] = useState<[[number, number]] | []>([]);
  const [agentsPosition, setAgentsPosition] = useState<AgentsPosition>({});
  const [chaserPosition, setChaserPosition] = useState<AgentsPosition>({});
  const [supportPosition, setSupportPosition] = useState<AgentsPosition>({});
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [occurrenceId, setOccurrenceId] = useState<string>('');
  const { socket } = useWork();

  useEffect(() => {
		socket.on('patrol:position', (position: any) => {
			setAgentsPosition((agents: any) => ({ ...agents, ...position }));
		});


		socket.on('police:cleanUp', (clientId: any) => {
			setAgentsPosition((agents: any) => {
				const { [clientId]: coords, ...rest } = agents;
				return rest;
			});
		});

    socket.on('police:finishedWork', (clientId: string) => {
      setAgentsPosition((agents: any) => {
				const { [clientId]: coords, ...rest } = agents;
				return rest;
			});
    });

		return () => {
			socket.off('patrol:position');
			socket.off('police:cleanUp');
			socket.off('operations:chaseAlert');
      socket.off('police:finishedWork');
		};
	}, [socket, setAgentsPosition]);

  return (
    <OperationsContext.Provider value={{
      chaserRoute,
      agentsPosition,
      chaserPosition,
      supportPosition,
      isSupporting,
      occurrenceId,
      setChaserRoute,
      setAgentsPosition,
      setChaserPosition,
      setSupportPosition,
      setIsSupporting,
      setOccurrenceId,
    }}>
      <MapContainer center={[-23.6589121,-46.8535893]} zoom={15} style={{ width: '100vw', height: '100vh' }}>
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <Outlet />
        {
          !isSupporting && Object.keys(agentsPosition).length ? (
            Object.keys(agentsPosition).map((client: string) => {
              const coords = agentsPosition[client];
              if(!coords) return null;
              return (
                <Fragment key={client}>
                  <PositionMarker position={agentsPosition[client] as LatLngExpression} />
                </Fragment>
              );
            })
          ) : null
        }
        {
          isSupporting && Object.keys(chaserPosition).length ? (
            Object.keys(chaserPosition).map((client: string) => {
              const coords = chaserPosition[client];
              if(!coords) return null;
              return (
                <Fragment key={client}>
                  <CircleMarker center={chaserPosition[client] as LatLngExpression} pathOptions={{ color: 'red' }} radius={100}>
                    <PositionMarker
                      position={chaserPosition[client] as LatLngExpression}
                      isChasing />
                  </CircleMarker>
                </Fragment>
              );
            })
          ) : null
        }
        {
          isSupporting && Object.keys(supportPosition).length ? (
            Object.keys(supportPosition).map((client: string) => {
              const coords = supportPosition[client];
              if(!coords) return null;
              return (
                <Fragment key={client}>
                  <PositionMarker
                      position={supportPosition[client] as LatLngExpression}
                      isSupporting />
                </Fragment>
              );
            })
          ) : null
        }
        {chaserRoute.length ? (
          <Polyline pathOptions={{ color: 'red' }} positions={chaserRoute}></Polyline>
        ) : null}
      </MapContainer>
    </OperationsContext.Provider>
  );
};



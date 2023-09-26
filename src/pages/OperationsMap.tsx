import '../styles/pages/operations-map.css'
import { useMemo, useEffect, useState, Fragment } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

import io from 'socket.io-client';
import PositionMarker from '../components/PositionMarker';
import SupportingPanel from '../components/SupportingPanel';

import { AgentsPosition } from '../components/agents-position.interface';

export default function OperationsMap() {
    const socket = useMemo(() => {
        return io(process.env.REACT_APP_SOCKET_SERVER as string, {
            query: { clientInitialRoom: 'operations' },
        }).connect()
    }, []);
    const [agentsPosition, setAgentsPosition] = useState<AgentsPosition>({});
    const [centerCamera, setCenterCamera] = useState([0, 0]);
    const [isSupporting, setIsSupporting] = useState<boolean>(false);
    const [chaseId, setChaseId] = useState<string>('');
    
    useEffect(() => {
        handleGetCurrentLocation();
    }, []);
    
    useEffect(() => {
        socket.on('positionToOperators', (position) => {
            setAgentsPosition(agents => ({ ...agents, ...position}));
        });
        
        socket.on('finishedPatrollingToOperators', (clientId) => {
            setAgentsPosition(agents => {
                const { [clientId]: coords, ...rest } = agents;
                return rest;
            });
        });

        socket.on('alertToOperators', async (chaseId) => {
            setChaseId(chaseId);
            const confirmed = window.confirm(`Entrar no acompanhamento ${chaseId}`);
            if (confirmed) {
                socket.removeAllListeners();
                socket.emit('acceptOperations', chaseId);
                setAgentsPosition({});
                setIsSupporting(true);
            };
        });
    }, [socket, isSupporting]);

    function toggleSupporting() {
        setAgentsPosition({});
        setIsSupporting(!isSupporting);
    }

    function handleSupportPosition(chasingId: string, position: number[]) {
        setAgentsPosition((agents) => {
            return { ...agents, [chasingId]: position };
        })
    }

    function handleCenterCamera(position: number[]) {
        setCenterCamera(position);
    }

    function handleGetCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {
                const { latitude, longitude } = location.coords;
                setCenterCamera([latitude, longitude]);
            }, (error) => console.error('Erro ao obter a localização:', error));
        } else {
            console.error('Geolocalização não suportada neste navegador.');
        }
    }

    return (
        <div id='page-map'>
            { isSupporting
                ? <SupportingPanel
                    connection={socket}
                    setAgents={handleSupportPosition}
                    toggleSupporting={toggleSupporting} />
                : (
                <aside>
                    <h1>Patrolling</h1>
                    {
                        Object.keys(agentsPosition).length ? (
                            Object.keys(agentsPosition).map((client: string) => {
                                const coords = agentsPosition[client as any];
                                if(!coords) return null;
                                return (
                                    <button key={client}>
                                        <p>{client}</p>
                                    </button>
                                );  
                            })
                        ) : <p>Nenhum policia na patrulha</p>
                    }
                </aside>
            )}
            {
                centerCamera && centerCamera[0] !== 0 ? (
                    <MapContainer center={centerCamera as LatLngExpression} zoom={15} style={{ width: '100%', height: '100%' }} >
                        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                        {
                            Object.keys(agentsPosition).length ? (
                                Object.keys(agentsPosition).map((client: string) => {
                                    const coords = agentsPosition[client];
                                    if(!coords) return null;
                                    return (
                                        <Fragment key={client}>
                                            <PositionMarker position={centerCamera as LatLngExpression} />
                                        </Fragment>
                                    );
                                })
                            ) : null
                        }
                    </MapContainer>
                ) : null
            }
        </div>
    );
}
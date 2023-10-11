import '../styles/pages/operations-map.css'
import { useEffect, useState, Fragment } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import PositionMarker from '../components/PositionMarker';
import SupportingPanel from '../components/SupportingPanel';

import { AgentsPosition } from '../components/agents-position.interface';
import { useNavigate } from 'react-router-dom';
import useWork from '../hooks/useWork';

export default function OperationsMap() {
    const { socket } = useWork();
    const [agentsPosition, setAgentsPosition] = useState<AgentsPosition>({});
    const [centerCamera, setCenterCamera] = useState([0, 0]);
    const [isSupporting, setIsSupporting] = useState<boolean>(false);
    const [chaseId, setChaseId] = useState<string>('');
    const navigate = useNavigate();
    
    useEffect(() => {
        handleGetCurrentLocation();
    }, []);
    
    useEffect(() => {
        socket.emit('startWork');

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

    function handleFinishWork() {
        socket.emit('finishWork');
        socket.disconnect();
        navigate('/dashboard')
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
                    <button onClick={handleFinishWork}>Finish Work</button>
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
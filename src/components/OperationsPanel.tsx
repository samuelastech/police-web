import '../styles/components/operations-panel.css';
import axios from '../api/axios';
import { useOperations, useWork } from '../hooks';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ButtonIcon } from './ButtonIcon';
import { Broadcast, AlignCenterHorizontal } from '@phosphor-icons/react';

export const OperationsPanel = () => {
  const { isSupporting } = useOperations();

  return (
    <div className='operations-panel'>
        {isSupporting ? <SupportingPanel /> : <DefaultPanel />}
    </div>
  );
};

const DefaultPanel = () => {
  const { agentsPosition } = useOperations();
  const { socket } = useWork();
  const map = useMap();
  const navigate = useNavigate();
  const [watching, setWatching] = useState('');
  const watchingPosition = watching ? agentsPosition[watching] : null;

  useMapEvents({
    click() {
      setWatching('');
    },
    drag() {
      setWatching('');
    },
  });

  useEffect(() => {
    if (watchingPosition) {
      map.flyTo(watchingPosition as LatLngExpression);
    }
  }, [map, watching, watchingPosition]);

  const finishWork = () => {
		socket.emit('agent:finishWork');
		navigate('/dashboard');
	};

  const centerCameraOnAgent = (agentId: string) => {
    setWatching(agentId);
  };

  return (
    <>
      <h1 className='title'>Policiais em patrulhamento</h1>
        <div className='table'>
          {
            Object.keys(agentsPosition).length ? (
              Object.keys(agentsPosition).map((agent: string) => {
                return (
                  <div className='table-row' key={agent} onClick={() => centerCameraOnAgent(agent)}>
                    <span className='name'>{agent}</span>
                    <div className='status -active'>
                      <span className='label'>Patrulhando</span>
                      <div className='signal'></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='nopolices'>Nenhum policial patrulhando</div>
            )
          }
      </div>
      <Button text='Encerrar operações' action={finishWork} color='orange' />
    </>
  )
};

const SupportingPanel = () => {
  const { socket } = useWork();
  const {
    setSupportPosition,
    setChaserPosition,
    setChaserRoute,
    chaserPosition,
    setIsSupporting,
  } = useOperations();
  const [address, setAddress] = useState<string>('');
  const [fixCam, setFixCam] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const position = chaserPosition[Object.keys(chaserPosition)[0]];
  const map = useMap();
  useMapEvents({
    click() {
      setFixCam(false);
    },
    drag() {
      setFixCam(false);
    },
    dblclick() {
      setFixCam(false);
    }
  });

  useEffect(() => {
    if (fixCam && position) {
      map.flyTo(position as LatLngExpression);
    }
  }, [fixCam, map, position]);

  useEffect(() => {
    socket.once('support:finishChase', () => {
      setSupportPosition({});
      setChaserPosition({});
      setChaserRoute([]);
      setIsSupporting(false);
    });

    socket.on('support:position', (position) => {
      setSupportPosition((agents: any) => {
        return { ...position, ...agents };
      });
    });

    socket.on('support:chaserPosition', (position: any) => {
      const key = Object.keys(position)[0];

      setChaserPosition((agents: any) => {
        return { ...position, ...agents };
      });

      setChaserRoute((coords: any) => {
        if (coords && coords.length) {
          return [...coords, position[key]];
        } else {
          return [position[key]];
        }
      });

      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${position[key][0]},${position[key][1]}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        )
        .then((response) => {
          console.log(response.data.results[0])
          setAddress(
            `${response.data.results[0]['address_components'][1]['long_name']}, ${response.data.results[0]['address_components'][2]['long_name']}, ${response.data.results[0]['address_components'][3]['long_name']}`,
          );
      });
    });
  }, [socket, setChaserPosition, setChaserRoute, setSupportPosition, setIsSupporting]);

  const requestSupport = () => {
    if (isLoading) {
      setIsLoading(false);
    } else {
      socket.emit('squad:supportRequest');
      setIsLoading(true);
    }
  };

  return (
    <>
      <h1 className='title'>Apoiando perseguição</h1>
      <div className='address'><span className='strong'>Endereço: </span>{address ? address : null}</div>
      <div className='actions'>
        <ButtonIcon text='Solicitar suporte' action={requestSupport} icon={Broadcast} color='blue' isLoading={isLoading} loadingText='Solicitando' />
        <ButtonIcon text='Centralizar câmera' action={() => setFixCam(true)} icon={AlignCenterHorizontal} color='red' />
      </div>
    </>
  );
};
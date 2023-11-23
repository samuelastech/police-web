import '../styles/pages/operations-map.css';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Modal, OperationsPanel } from '../components/';
import { useWork, useOperations } from '../hooks/';

export const OperationsMap = () => {
	const { socket } = useWork();
	const {
		setAgentsPosition,
		setOccurrenceId,
		setIsSupporting,
		occurrenceId,
	} = useOperations();
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
	const map = useMap();

	const getCurrentLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((location) => {
				const { latitude, longitude } = location.coords;
				map.flyTo([latitude, longitude]);
			}, (error) => console.error('Erro ao obter a localização:', error));
		} else {
			console.error('Geolocalização não suportada neste navegador.');
		}
	}, [map]);

	useEffect(() => {
		getCurrentLocation();
	}, [map, getCurrentLocation]);

	useEffect(() => {
		socket.on('operations:chaseAlert', (data: any) => {
			setOccurrenceId(data.occurrenceId);
			setModalIsOpen(true);
		});
	}, [socket, setOccurrenceId]);

	const acceptSupporting = () => {
		socket.emit('operations:acceptChase', occurrenceId);
		setAgentsPosition({});
		setIsSupporting(true);
	};

	return (
		<div id='page-map'>
			<Modal
				text='Um policial iniciou um acompanhamento, iniciar monitoração?'
				action={acceptSupporting}
				isOpen={modalIsOpen}
				setIsOpen={setModalIsOpen}
				buttonText='Aceitar' />
			<OperationsPanel />
		</div>
	);
}

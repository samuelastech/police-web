import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon, Point } from 'leaflet';

interface Props {
  position: LatLngExpression;
  isChasing?: boolean
  isSupporting?: boolean
}

const setIcon = (filename: string) => {
  return new Icon({
    iconUrl: require(`../images/${filename}.png`),
    iconRetinaUrl: require(`../images/${filename}.png`),
    iconSize: new Point(30, 30),
  });
}

const marker = (MarkerIcon: Icon, position: LatLngExpression) => {
  return (
    <Marker icon={MarkerIcon} position={position}>
      <Popup>
        <a href='http://192.168.43.156' target='_blank' rel="noreferrer">Abrir câmera</a>
      </Popup>
    </Marker>
  );
}

export const PositionMarker = ({ position, isChasing, isSupporting }: Props) => {
  
  if (isChasing) {
    const MarkerOccurrence = setIcon('MarkerOccurrence');
    return marker(MarkerOccurrence, position);
  } else if (isSupporting) {
    const MarkerSupporting = setIcon('MarkerSupporting');
    return marker(MarkerSupporting, position);
  } else {
    const MarkerPatrol = setIcon('MarkerPatrol');
    return marker(MarkerPatrol, position);
  }
}

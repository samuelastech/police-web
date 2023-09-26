import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface Props {
  position: LatLngExpression;
}

export default function PositionMarker({ position }: Props) {
  return (
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  );
}

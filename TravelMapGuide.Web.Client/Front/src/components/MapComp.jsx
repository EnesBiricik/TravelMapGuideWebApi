import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComp = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    console.log(lat, lng);
    onLocationSelect({ lat, lng });
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '200px' }}
      center={{ lat: 37.874641, lng: 32.493156}}
      zoom={8}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: true,
        keyboardShortcuts: false,
      }}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapComp;

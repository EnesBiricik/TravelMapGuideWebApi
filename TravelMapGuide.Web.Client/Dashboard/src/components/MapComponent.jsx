import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    console.log(lat,lng);
    onLocationSelect({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCgJpq5GyTKq7sUtvlIzbFGNYhKDPFXF-0">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px' }}
        center={{ lat: -33.8567844, lng: 151.213108 }}
        zoom={10}
        onClick={handleMapClick}
        options={{
            disableDefaultUI: true,
            keyboardShortcuts: false, 
          }}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;

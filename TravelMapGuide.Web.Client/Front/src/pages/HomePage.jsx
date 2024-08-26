import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const locations = [
    { key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108 } },
];

export const HomePage = () => {
    return (
        <Fragment>
            <APIProvider apiKey={'AIzaSyA9KYxLkCdyWJss0BcAVJ06HNHU7e65I_I'} onLoad={() => console.log('Maps API has loaded.')}>
                <Map style={{position:'fixed'}}
                    defaultZoom={13}
                    defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                    mapId='f35f13567816558a'
                    onCameraChanged={(ev) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }
                >
                    <PoiMarkers pois={locations} />
                </Map>
            </APIProvider>
        </Fragment>
    );
};

const PoiMarkers = (props) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);
    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers, if the markers array has changed
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker, key) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const handleClick = useCallback((ev) => {
        if (!map) return;
        if (!ev.latLng) return;
        console.log('marker clicked:', ev.latLng.toString());
        map.panTo(ev.latLng);
    });

    return (
        <>
            {props.pois.map((poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={handleClick}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default HomePage;

import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Modal, Button, Input } from 'antd'; // Ant Design componentleri
import { PlusOutlined } from '@ant-design/icons';
import './Home.css'; // Stil dosyası
import MarkerDetails from '../components/MarkerDetails'; // MarkerDetails bileşeni

const HomePage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);

    const options = {
        disableDefaultUI: true, // Tüm varsayılan kontrolleri kapatır
        zoomControl: false,     // Zoom kontrolünü kapatır
        fullscreenControl: false, // Tam ekran kontrolünü kapatır
        streetViewControl: false, // Pegman kontrolünü kapatır
    };
    console.log("tryOut")
    useEffect(() => {
        fetch('https://localhost:7018/api/Travel/Get')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data:", data);
                if (data.isSuccess) {
                    const selectedLocations = data.data
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 100)
                        .map(location => ({
                            key: location.id,
                            location: { 
                                lat: parseFloat(location.latitude),
                                lng: parseFloat(location.longitude)
                            },
                            name: location.name,
                            description: location.description,
                            starReview: location.starReview,
                            cost: location.cost,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            imageUrl: location.imageUrl
                        }));
                    setLocations(selectedLocations);
                } else {
                    console.error("Failed to fetch locations:", data.message);
                }
            })
            .catch(error => console.error('Error fetching locations:', error));
    }, []);
    
    
    const handleAddClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsModalVisible(true);
        } else {
            // Token yoksa login sayfasına yönlendir
            window.location.href = '/login';
        }
    };

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleDetailsClose = () => {
        setSelectedLocation(null);
    };

    return (
        <Fragment>
            <APIProvider
                apiKey={'AIzaSyD6q26VxpqFEmDxqpPJBQljI84WDiYLt-k'}
                onLoad={() => console.log('Maps API has loaded.')}
            >
                <div className="header">
                    <Input.Search
                        placeholder="Search locations..."
                        onSearch={value => console.log(value)}
                        className="custom-search"
                    />
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleAddClick}
                        className="custom-button"
                    >
                        Add
                    </Button>
                </div>
                <div className="map-container">
                    <Map
                        style={{ width: selectedLocation ? '75%' : '100%', height: '100vh' }}
                        defaultZoom={7}
                        defaultCenter={{ lat: 37.870737, lng: 32.504982}}
                        mapId='f35f13567816558a'
                        options={options}
                    >
                        <PoiMarkers pois={locations} onMarkerClick={handleMarkerClick} />
                    </Map>
                    {selectedLocation && (
                        <MarkerDetails markerData={selectedLocation} onClose={handleDetailsClose} />
                    )}
                </div>
            </APIProvider>

            <Modal
                title="Create Travel"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                {/* Buraya createTravel componentini ekleyebilirsin */}
                <Button type="primary" onClick={handleModalClose}>
                    Save
                </Button>
            </Modal>
        </Fragment>
    );
};

const PoiMarkers = (props) => {
    const map = useMap();
    const [markers, setMarkers] = useState({});
    const clusterer = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

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

    const handleClick = useCallback((ev, poi) => {
        if (!map) return;
        if (!ev.latLng) return;
        console.log('marker clicked:', ev.latLng.toString());
        map.panTo(ev.latLng);
        props.onMarkerClick(poi); // Marker tıklandığında detayları göster
    }, [map, props]);

    return (
        <>
            {props.pois.map((poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={(ev) => handleClick(ev, poi)}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default HomePage;

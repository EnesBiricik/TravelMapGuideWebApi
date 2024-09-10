import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap
} from '@vis.gl/react-google-maps';
import { Modal, Button, Input } from 'antd';
import { PlusOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import './Home.css';
import MarkerDetails from '../components/MarkerDetails';
import SidePanel from '../components/SidePanel';
import UserDetails from '../components/UserDetails';
import { MarkerClusterer } from '@googlemaps/markerclusterer';


const HomePage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [userTravels, setUserTravels] = useState([]);

    const token = localStorage.getItem('jwtToken');

    if (!token || typeof token !== 'string') {
        console.log('Invalid or missing JWT token.');
    }

    const options = {
        disableDefaultUI: true, // Tüm varsayılan kontrolleri kapatır
        zoomControl: false,     // Zoom kontrolünü kapatır
        fullscreenControl: false, // Tam ekran kontrolünü kapatır
        streetViewControl: false, // Pegman kontrolünü kapatır
    };

    useEffect(() => {
        if (selectedUser) {
            fetch(`https://localhost:7018/api/Travel/GetTravelByUserId?userId=${selectedUser.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        const filteredLocations = data.map(travel => ({
                            key: travel.id,
                            location: {
                                lat: parseFloat(travel.latitude),
                                lng: parseFloat(travel.longitude),
                            },
                            name: travel.name,
                            description: travel.description,
                            starReview: travel.starReview,
                            cost: travel.cost,
                            latitude: travel.latitude,
                            longitude: travel.longitude,
                            imageUrl: travel.imageUrl,
                            user: selectedUser
                        }));
                        setLocations(filteredLocations);
                    } else {
                        console.error('No travels found for this user.');
                        setLocations([]);
                    }
                })
                .catch(error => console.error('Error fetching user travels:', error));
        } else {
            fetch('https://localhost:7018/api/Travel/Get')
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.isSuccess) {
                        const selectedLocations = data.data
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 100)
                            .map(location => ({
                                key: location.id,
                                location: {
                                    lat: parseFloat(location.latitude),
                                    lng: parseFloat(location.longitude),
                                },
                                name: location.name,
                                description: location.description,
                                starReview: location.starReview,
                                cost: location.cost,
                                latitude: location.latitude,
                                longitude: location.longitude,
                                imageUrl: location.imageUrl,
                                user: {
                                    username: location.user.username,
                                    imageUrl: location.user.imageUrl,
                                    id: location.user.id,
                                }
                            }));
                        setLocations(selectedLocations);
                    } else {
                        console.error("Failed to fetch locations:", data.message);
                    }
                })
                .catch(error => console.error('Error fetching locations:', error));
        }
    }, [selectedUser]);

    const handleUsernameClick = (user) => {
        console.log('User clicked:', user);

        if (!user || !user.id) {
            console.error('Invalid user data:', user);
            return;
        }

        setSelectedUser(user);
        setSelectedLocation(null);

        fetch(`https://localhost:7018/api/Travel/GetTravelByUserId?userId=${user.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                
                console.log(data);

                if (Array.isArray(data) && data.length > 0) {
                    setUserTravels(data);
                    console.log('User travels fetched:', data);
                } else {
                    console.error('No travels found for this user.');
                }
            })
            .catch(error => console.error('Error fetching user travels:', error));
    };

    const handleAddClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsModalVisible(true);
        } else {
            
            window.location.href = '/login';
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleMarkerClick = (location) => {
        setSelectedUser(null);
        setSelectedLocation(location);
    };

    const handleDetailsClose = () => {
        setSelectedLocation(null);
        setSelectedUser(null);
    };

    return (
        <Fragment>
            <APIProvider
                apiKey={'AIzaSyCgJpq5GyTKq7sUtvlIzbFGNYhKDPFXF-0'}
                onLoad={() => console.log('Maps API has loaded.')}
            >
                <div className="header">
                    <Input.Search
                        placeholder="Search locations..."
                        onSearch={""}
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
                    <Button
                        icon={token ? <LogoutOutlined /> : <LoginOutlined />}
                        type="primary"
                        className="auth-button"
                    >
                        {token ? 'Logout' : 'Login'}
                    </Button>
                </div>
                <div className="map-container">
                    <Map
                        style={{ width: selectedLocation ? '100%' : '100%', height: '100vh' }}
                        defaultZoom={3}
                        defaultCenter={{ lat: 37.870737, lng: 32.504982 }}
                        mapId='f35f13567816558a'
                        options={options}
                    >
                        <PoiMarkers pois={locations} onMarkerClick={handleMarkerClick} />

                    </Map>
                    {selectedLocation && (
                        <SidePanel onClose={handleDetailsClose}>
                            <MarkerDetails markerData={selectedLocation} onUsernameClick={handleUsernameClick} />
                        </SidePanel>
                    )}
                    {selectedUser && (
                        <SidePanel onClose={handleDetailsClose}>
                            <UserDetails userData={selectedUser} userTravels={userTravels} />
                        </SidePanel>
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
    const [markers, setMarkers] = useState([]);
    const clusterer = useRef(null);

    useEffect(() => {
        if (!map || !props.pois.length) return;

        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }

        const newMarkers = props.pois.map((poi) => {
            const marker = new google.maps.Marker({
                position: poi.location,
                map: map,
                clickable: true
            });

            marker.addListener('click', (ev) => {
                if (ev.latLng) {
                    map.panTo(ev.latLng);
                    props.onMarkerClick(poi);
                }
            });

            return marker;
        });

        clusterer.current.clearMarkers();
        clusterer.current.addMarkers(newMarkers);
        setMarkers(newMarkers);

        return () => {
            newMarkers.forEach(marker => marker.setMap(null));
        };
    }, [map, props.pois]);

    return (
        <>
            {props.pois.map((poi, index) => (
                <AdvancedMarker
                    key={poi.id || poi.key || index}
                    position={poi.location}
                >
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #000',
                        background: '#fff'
                    }}>
                        <img
                            src={`https://localhost:7018/img/${poi.imageUrl}`}
                            alt={poi.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </AdvancedMarker>
            ))}
        </>
    );
};

export default HomePage;

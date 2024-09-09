import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    Pin
} from '@vis.gl/react-google-maps';
import { Modal, Button, Input } from 'antd'; // Ant Design componentleri
import { PlusOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import './Home.css'; // Stil dosyası
import MarkerDetails from '../components/MarkerDetails'; // MarkerDetails bileşeni
import SidePanel from '../components/SidePanel';
import UserDetails from '../components/UserDetails';

const HomePage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // State to track the selected user
    //setsidepanel => marker and user detail
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [userTravels, setUserTravels] = useState([]);

    const token = localStorage.getItem('jwtToken');

    // Token geçerli değilse, hata mesajını konsola yazdırır
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
        fetch('https://localhost:7018/api/Travel/Get')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
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
    }, []);

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
                        setLocations([]); // Temizle veya varsayılan bir durum ayarla
                    }
                })
                .catch(error => console.error('Error fetching user travels:', error));
        } else {
            // Kullanıcı seçilmemişse, varsayılan olarak tüm locationsları tekrar ayarla
            fetch('https://localhost:7018/api/Travel/Get')
                .then(response => response.json())
                .then(data => {
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
        console.log('User clicked:', user); // Debugging line to check user data

        if (!user || !user.id) {
            console.error('Invalid user data:', user);
            return;
        }

        setSelectedUser(user);
        setSelectedLocation(null); // Hide marker details when user details are displayed

        fetch(`https://localhost:7018/api/Travel/GetTravelByUserId?userId=${user.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Gelen veri doğrudan bir dizi olduğundan, data ile çalışıyoruz
                console.log(data); // Gelen veriyi konsola logluyoruz

                if (Array.isArray(data) && data.length > 0) {
                    setUserTravels(data); // Veriyi state'e kaydediyoruz
                    console.log('User travels fetched:', data); // Debugging line to check travels
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
            // Token yoksa login sayfasına yönlendir
            window.location.href = '/login';
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
        setSelectedUser(null); // Hide user details when marker details are displayed
    };

    const handleDetailsClose = () => {
        setSelectedLocation(null);
        setSelectedUser(null); // Close both details when clicking outside
    };

    return (
        <Fragment>
            <APIProvider
                apiKey={'AIzaSyCffPbPK4Jn3FYEP5L9gclCMWtJ221Vx2Q'}
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
    const [markers, setMarkers] = useState({});
    // const clusterer = useRef(null);

    // useEffect(() => {
    //     if (!map) return;
    //     if (!clusterer.current) {
    //         clusterer.current = new MarkerClusterer({ map });
    //     }
    // }, [map]);

    // useEffect(() => {
    //     clusterer.current?.clearMarkers();
    //     clusterer.current?.addMarkers(Object.values(markers));
    // }, [markers]);

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
        map.panTo(ev.latLng);
        props.onMarkerClick(poi); // Marker tıklandığında detayları göster
    }, [map, props]);

    return (
        <>
            {props.pois.map((poi, index) => (
                <AdvancedMarker
                    key={poi.key || poi.id || index}  // Benzersiz bir key kullan
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={(ev) => handleClick(ev, poi)}
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

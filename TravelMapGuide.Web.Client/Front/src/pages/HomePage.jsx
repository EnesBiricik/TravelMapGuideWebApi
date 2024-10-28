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
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import MapComp from '../components/MapComp';
import { jwtDecode } from "jwt-decode"

const HomePage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFeatureModalVisible, setFeatureModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState({ lat: '', lng: '' });
    const [rating, setRating] = useState(0);
    const [cost, setCost] = useState(0);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [userTravels, setUserTravels] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expireMonth, setExpireMonth] = useState('');
    const [expireYear, setExpireYear] = useState('');
    const [cvc, setCvc] = useState('');
    const price = 10; // Sabit fiyat, readonly alan olarak gösterilecek

    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();


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
            fetch(`http://localhost:7018/api/Travel/GetTravelByUserId?userId=${selectedUser.id}`)
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
                            user: selectedUser,
                            isFeatured: travel.isFeatured
                        }));
                        setLocations(filteredLocations);
                    } else {
                        console.error('No travels found for this user.');
                        setLocations([]);
                    }
                })
                .catch(error => console.error('Error fetching user travels:', error));
        } else {
            fetch('http://localhost:7018/api/Travel/Get')
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
                                },
                                isFeatured: location.isFeatured
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

        fetch(`http://localhost:7018/api/Travel/GetTravelByUserId?userId=${user.id}`)
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
        //console.error('token', token)
        if (token) {
            setIsModalVisible(true);
        } else {
            navigate('/Login')
        }
    };

    const handleMarkerClick = (location) => {
        setSelectedUser(null);
        setSelectedLocation(location);
    };

    const handleDetailsClose = () => {
        setSelectedLocation(null);
        setSelectedUser(null);
    };

    const openFeatureModalVisible = () => {
        setFeatureModalVisible(true)
        console.error("açıldı");

    }

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:7018/api/User/Logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            localStorage.removeItem('jwtToken');
            navigate('/login'); // Yönlendirme işlemi
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleClick = () => {
        if (token) {
            handleLogout();
        } else {
            navigate('/login'); // Token yoksa yönlendir
        }
    };

    const handleLocationSelect = (location) => {
        setLocation(location);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setFeatureModalVisible(false)
        setLocation({ lat: '', lng: '' });
        setRating(0);
        setCost(0);
        setName('');
        setComment('');
        setImage(null);
        setCardHolderName('');
        setCardNumber('');
        setExpireMonth('');
        setExpireYear('');
        setCvc('');
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token || typeof token !== 'string') {
            console.error('Invalid or missing JWT token.');
            return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('name', name);
        formData.append('description', comment);
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('date', new Date().toISOString());
        formData.append('starReview', rating);
        formData.append('cost', cost);
        if (image) {
            formData.append('image', image);
        }

        try {
            console.log("Creating travel with location:", location.lat, location.lng);
            const response = await fetch("http://localhost:7018/api/Travel/Post", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            console.error("response", response)

            if (response.ok) {
                const responseData = await response.json();
                console.error('responseData', responseData);

                if (responseData.isSuccess) {
                    console.log("Travel data successfully submitted");
                    const newTravelData = {
                        key: responseData.data.id,
                        location: {
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.lng),
                        },
                        name: responseData.data.name,
                        description: responseData.data.description,
                        starReview: responseData.data.starReview,
                        cost: responseData.data.cost,
                        latitude: responseData.data.latitude,
                        longitude: responseData.data.longitude,
                        imageUrl:
                            responseData.data.imageUrl instanceof Blob
                                ? URL.createObjectURL(responseData.data.imageUrl)
                                : responseData.data.imageUrl,
                        user: responseData.data.user,
                        isFeatured : response.data.isFeatured,
                    };
                    setLocations((prevLocations) => [...prevLocations, newTravelData]);
                }
                setIsModalVisible(false);
            }
            else {
                const errorData = await response.json();
                console.error("Failed to submit travel data:", errorData);
            }
        } catch (error) {
            console.error("Error submitting travel data:", error);
            setIsModalVisible(false);
        }
    };

    const handlePay = async () => {
        const paymentData = {
            cardNumber,
            cardHolderName,
            expireMonth,
            expireYear,
            cvc,
            price,
            travelId: selectedLocation.key,
        };

        console.error("Gönderilen Veri:", paymentData); 

        try {
            const response = await fetch('http://localhost:7018/api/Payments/MakePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
            } else {
                console.error(data.errormessage || 'Ödeme alınamadı');
            }
        } catch (error) {
            console.error('Ödeme isteği başarısız:', error);
            alert('Ödeme isteğinde bir hata oluştu.');
        }

        handleModalClose();
    };

    useEffect(() => {
        if (locations.length > 0) {
            // Burada bir bildirim veya başka bir efekt uygulayabilirsiniz
            console.log("Yeni konum eklendi!", locations[locations.length - 1]);
            // Örneğin, bir bildirim mesajı gösterebilirsiniz
        }
    }, [locations]);

    return (
        <Fragment>
            <APIProvider
                apiKey={'AIzaSyAuI3VwUmiLgh5wE4i6nGB7ocBnzaRnGsA'}
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
                        onClick={handleClick} // Tıklama olayını handleClick ile yönetiyoruz
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
                        <SidePanel onClose={handleDetailsClose} openModal={openFeatureModalVisible}>
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
                {/* Map Component */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Location</span>
                        <MapComp onLocationSelect={handleLocationSelect} />
                        {/* {location.lat && location.lng && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Selected Location: {`Lat: ${location.lat}, Lng: ${location.lng}`}
                            </p>
                        )} */}
                    </label>
                </div>

                {/* Name Input */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Name</span>
                        <Input
                            className="mt-1"
                            value={name}
                            placeholder="Enter your travel name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>

                {/* Rating Input */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Rating (1-5)</span>
                        <Input
                            type="number"
                            className="mt-1"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="1"
                            max="5"
                            placeholder="Enter a rating between 1 and 5"
                        />
                    </label>
                </div>

                {/* Amount Input */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Amount ($)</span>
                        <Input
                            type="number"
                            className="mt-1"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            min="1"
                            placeholder="Enter an amount"
                        />
                    </label>
                </div>

                {/* Comment Input */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Comment</span>
                        <TextArea
                            className="mt-1"
                            rows="3"
                            placeholder="Enter your comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </label>
                </div>

                {/* Image Input */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg">
                    <label>
                        <span>Image</span>
                        <Input
                            type="file"
                            className="mt-1"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg flex justify-end">
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button className="ml-4" onClick={handleModalClose}>
                        Cancel
                    </Button>
                </div>
            </Modal>
            <Modal
                title="Make a Payment"
                open={isFeatureModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                {/* Card Number Input */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>Card Number</span>
                        <Input
                            className="mt-1"
                            value={cardNumber}
                            placeholder="Enter your card number"
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </label>
                </div>

                {/* Card Holder Name Input */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>Card Holder Name</span>
                        <Input
                            className="mt-1"
                            value={cardHolderName}
                            placeholder="Enter the card holder's name"
                            onChange={(e) => setCardHolderName(e.target.value)}
                        />
                    </label>
                </div>

                {/* Expiry Month Input */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>Expiry Month</span>
                        <Input
                            className="mt-1"
                            value={expireMonth}
                            placeholder="MM"
                            onChange={(e) => setExpireMonth(e.target.value)}
                        />
                    </label>
                </div>

                {/* Expiry Year Input */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>Expiry Year</span>
                        <Input
                            className="mt-1"
                            value={expireYear}
                            placeholder="YYYY"
                            onChange={(e) => setExpireYear(e.target.value)}
                        />
                    </label>
                </div>

                {/* CVC Input */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>CVC</span>
                        <Input
                            className="mt-1"
                            value={cvc}
                            placeholder="CVC"
                            onChange={(e) => setCvc(e.target.value)}
                        />
                    </label>
                </div>

                {/* Price (Readonly) */}
                <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg">
                    <label>
                        <span>Price</span>
                        <Input
                            className="mt-1"
                            value={10}
                            readOnly
                        />
                    </label>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="px-4 py-3 mb-8 bg-gray-100 rounded-lg flex justify-end">
                    <Button type="primary" onClick={handlePay}>
                        Submit
                    </Button>
                    <Button className="ml-4" onClick={handleModalClose}>
                        Cancel
                    </Button>
                </div>
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
                        border: poi.isFeatured == true ? '10px solid #fff' : '10px solid #000',
                        background: '#fff'
                    }}>
                        <img
                            src={`http://localhost:7018/img/${poi.imageUrl}`}
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

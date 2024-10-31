/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import MarkerDetails from "../components/MarkerDetails";
import SidePanel from "../components/SidePanel";
import UserDetails from "../components/UserDetails";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../constants/Endpoints";
import { PoiMarkers } from "../components/PoiMarkers";
import "../assets/styles/Home.css";
import { options } from "../constants/MapOptions";

export default function MapContainer({ props }) {
  const {
    selectedLocation,
    selectedUser,
    locations,
    setSelectedUser,
    setSelectedLocation,
    setFeatureModalVisible,
  } = props;

  const [userTravels, setUserTravels] = useState([]);
  const navigate = useNavigate();

  const handleMarkerClick = (location) => {
    setSelectedUser(null);
    setSelectedLocation(location);
  };

  const handleDetailsClose = () => {
    setSelectedLocation(null);
    setSelectedUser(null);
  };

  const openFeatureModalVisible = () => {
    setFeatureModalVisible(true);
  };

  const handleUsernameClick = (user) => {
    if (!user || !user.id) {
      console.error("Invalid user data:", user);
      return;
    }

    setSelectedUser(user);
    setSelectedLocation(null);

    fetch(
      `${API_ENDPOINTS.DEFAULT_URL}api/Travel/GetTravelByUserId?userId=${user.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          setUserTravels(data);
        } else {
          console.error("No travels found for this user.");
        }
      })
      .catch((error) => console.error("Error fetching user travels:", error));
  };

  return (
    <div className="map-container">
      <Map
        style={{
          width: selectedLocation ? "100%" : "100%",
          height: "100vh",
        }}
        defaultZoom={3}
        defaultCenter={{ lat: 37.870737, lng: 32.504982 }}
        mapId="f35f13567816558a"
        options={options}
      >
        <PoiMarkers pois={locations} onMarkerClick={handleMarkerClick} />
      </Map>

      {selectedLocation && (
        <SidePanel
          onClose={handleDetailsClose}
        >
          <MarkerDetails
            markerData={selectedLocation}
            openModal={openFeatureModalVisible}

            onUsernameClick={handleUsernameClick}
          />
        </SidePanel>
      )}

      {selectedUser && (
        <SidePanel onClose={handleDetailsClose}>
          <UserDetails userData={selectedUser} userTravels={userTravels} />
        </SidePanel>
      )}
    </div>
  );
}

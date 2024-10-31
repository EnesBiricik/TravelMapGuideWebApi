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
import { Modal, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import MapComp from "../components/MapComp";
import { jwtDecode } from "jwt-decode";
import { KEYS } from "../constants/Keys";
import { API_ENDPOINTS } from "../constants/Endpoints";
import "../assets/styles/Home.css";
import PaymentModal from "../components/PaymentModal";
import {
  fetchAllTravels,
  fetchTravelsByUserId,
} from "../service/travelService";
import { mapNewTravelData, mapTravelData } from "../utils/CustomMapper";
import MapContainer from "../components/MapContainer";
import HomeHeader from "../components/HomeHeader";
import TravelCreateModal from "../components/TravelCreateModal";

const HomePage = () => {
  const token = localStorage.getItem("jwtToken");
  const decodedToken = token ? jwtDecode(token) : null;

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuth, setAuth] = useState(
    new Date(decodedToken?.exp * 1000) > new Date()
  );
  const [isFeatureModalVisible, setFeatureModalVisible] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const loadTravels = async () => {
      try {
        const data = selectedUser
          ? await fetchTravelsByUserId(selectedUser.id)
          : await fetchAllTravels();
        console.log(data);
        const mappedLocations = mapTravelData(data, selectedUser);
        setLocations(mappedLocations);
      } catch (error) {
        console.error("Error loading travels:", error);
      }
    };

    loadTravels();
  }, [selectedUser]);

  return (
    <Fragment>
      <APIProvider apiKey={KEYS.MAP_API_KEY}>
        <HomeHeader props={{ isModalVisible, setIsModalVisible, isAuth }} />

        <MapContainer
          props={{
            selectedLocation,
            selectedUser,
            locations,
            setSelectedUser,
            setSelectedLocation,
            setFeatureModalVisible,
          }}
        />
      </APIProvider>

      <TravelCreateModal
        props={{ setLocations, setIsModalVisible, isModalVisible }}
      />

      <PaymentModal
        travelId={selectedLocation?.key}
        isFeatureModalVisible={isFeatureModalVisible}
        setFeatureModalVisible={setFeatureModalVisible}
      />
    </Fragment>
  );
};

export default HomePage;

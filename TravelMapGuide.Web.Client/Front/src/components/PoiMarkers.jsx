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
import { PlusOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import MarkerDetails from "../components/MarkerDetails";
import SidePanel from "../components/SidePanel";
import UserDetails from "../components/UserDetails";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import MapComp from "../components/MapComp";
import { jwtDecode } from "jwt-decode";
import { KEYS } from "../constants/Keys";
import { API_ENDPOINTS } from "../constants/Endpoints";
import "../assets/styles/Home.css";

export const PoiMarkers = (props) => {
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
        clickable: true,
      });

      marker.addListener("click", (ev) => {
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
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, props.pois]);

  return (
    <>
      {props.pois.map((poi, index) => (
        <AdvancedMarker
          key={poi.id || poi.key || index}
          position={poi.location}
          onClick={() => props.onMarkerClick(poi)} // Tıklanabilir alanı burada yönetiyoruz
        >
          <div
            
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "50%",
              overflow: "hidden",
              border:
                poi.isFeatured == true ? "4px solid #fff" : "4px solid #000",
              background: "#fff",
              cursor: "pointer", // İşaretçi tıklanabilir alan olduğunu gösterir
            }}
            onClick={(e) => {
              e.stopPropagation(); // Tıklama olayını durdurmak için
              props.onMarkerClick(poi);
            }}
          >
            <img
              src={`${API_ENDPOINTS.DEFAULT_URL}img/${poi.imageUrl}`}
              alt={poi.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
};

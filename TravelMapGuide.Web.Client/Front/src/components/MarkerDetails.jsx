/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { KEYS } from "../constants/Keys";
import { API_ENDPOINTS } from "../constants/Endpoints";

const MarkerDetails = ({ markerData, onUsernameClick, openModal }) => {
  const [adres, setAdres] = useState("");

  if (!markerData) return null;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= (markerData.starReview || 0) ? "#fff005" : "#e4e5e9",
          }}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    if (!markerData.latitude || !markerData.longitude) return;

    const apiKey = KEYS.MAP_API_KEY;
    const latitude = markerData.latitude;
    const longitude = markerData.longitude;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const address = data.results[0].formatted_address;
          setAdres(address);
        } else {
          console.error("Geocoding error:", data.status);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [markerData]);

  return (
    <>
      {markerData.imageUrl && (
        <img
          src={`${API_ENDPOINTS.DEFAULT_URL}img/${markerData.imageUrl}`} // Resim URL'sini tamamlayın
          alt={markerData.name || "Resim"}
          style={{ width: "100%", height: "220px", objectFit: "cover" }} // Stil ayarları
        />
      )}
      <div style={styles.padding}>
        <h1
          style={
            markerData.isFeatured == true
              ? styles.titleForFeatured
              : styles.title
          }
        >
          {markerData.name || "Bilgi Yok"}
        </h1>
        <div style={styles.userInfoContainer}>
          <img
            src={
              markerData.user?.imageUrl
                ? `${API_ENDPOINTS.DEFAULT_URL}img/${markerData.user.imageUrl}`
                : "/path/to/default-profile.jpg"
            } // Profil resmi URL'si
            alt={markerData.user?.username || "Profil Resmi"}
            style={styles.profileImage}
          />
          <a
            style={styles.userNameLink}
            onClick={() => {
              if (markerData.user && markerData.user.id) {
                onUsernameClick(markerData.user); // Only trigger if user and user.id exist
              } else {
                console.error("User ID is missing or undefined.");
              }
            }}
          >
            {markerData.user?.username || "Bilinmeyen User"}
          </a>
        </div>
        <p>
          <strong>⭐ Star Review:</strong> {renderStars()}
        </p>
        <p>
          <strong>💲 Cost:</strong> ${markerData.cost || "Bilinmiyor"}
        </p>
        <p>
          <strong>📍 Adres:</strong> {adres || "Adres bulunamadı"}
        </p>
        <p>
          <strong>🗯️ Description:</strong>{" "}
          {markerData.description || "Açıklama yok"}
        </p>

        {markerData.isFeatured != true ? (
          <div>
            <button className="btn btn-success" onClick={openModal}>Feature this Post $</button>
          </div>
        ):(<p><strong>💸</strong> This post featured by owner</p>)}
      </div>
    </>
  );
};

const styles = {
  userInfoContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  profileImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  userNameLink: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  padding: {
    padding: "1rem",
  },
  title: {
    color: "#fff",
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    marginBottom: "10px",
    marginTop: "0px",
  },
  titleForFeatured: {
    color: "#1677ff",
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    marginBottom: "10px",
    marginTop: "0px",
  },
};

export default MarkerDetails;

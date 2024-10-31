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
import { Modal, Button, Input, Rate, Image, Upload } from "antd";
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
  submitTravelData,
} from "../service/travelService";
import { mapNewTravelData, mapTravelData } from "../utils/CustomMapper";
import { PlusOutlined } from "@ant-design/icons";

export default function TravelCreateModal({ props }) {
  const { setLocations, setIsModalVisible, isModalVisible } = props;

  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [rating, setRating] = useState(1);
  const [cost, setCost] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Sadece tek dosya tutuyoruz
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setLocation({ lat: "", lng: "" });
    setRating(1);
    setCost(0);
    setName("");
    setComment("");
    setImage(null);
    setFileList([]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token || typeof token !== "string") {
      console.error("Invalid or missing JWT token.");
      alert("You need login first");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", name);
    formData.append("description", comment);
    formData.append("latitude", location.lat.toString());
    formData.append("longitude", location.lng.toString());
    formData.append("date", new Date().toISOString());
    formData.append("starReview", rating);
    formData.append("cost", cost);

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    } else {
      alert("Image required");
      return;
    }

    try {
      const responseData = await submitTravelData(token, formData);

      if (responseData.isSuccess) {
        alert("Created Successfully.");
        const newTravelData = mapNewTravelData(responseData.data);
        setLocations((prevLocations) => [...prevLocations, newTravelData]);
      }
      setIsModalVisible(false);
    } catch (error) {
      alert("Error.");
      console.error("Error submitting travel data:", error);
      setIsModalVisible(false);
    }
  };

  return (
    <Modal
      className="TravelCreateModal"
      title="Create Travel"
      open={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
    >
      <div className="row  px-1 pb-2 mb-1">
        <div className="col-8 col-xs-12">
          <div className="bg-gray-100 mapInputDiv">
            <label className="mb-1">Location</label>
            <MapComp onLocationSelect={handleLocationSelect} zoom={3} />
          </div>
        </div>
        <div className="col-4 col-xs-12">
          <label className="mb-1">Image</label>
          {fileList.length === 0 ? (
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          ) : (
            <Image
              src={URL.createObjectURL(fileList[0].originFileObj)}
              alt="Uploaded Image Preview"
              style={{ borderRadius: 10 }}
              preview={false}
            />
          )}
        </div>
      </div>

      {/* Name Input */}
      <div className="px-1 py-1 my-2 bg-gray-100">
        <label>
          <span>Name</span>
        </label>
        <Input
          className="mt-1"
          value={name}
          placeholder="Enter your travel name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Amount Input */}
      <div className="px-1 py-1 my-2 bg-gray-100">
        <label>
          <span>Amount ($)</span>
        </label>
        <Input
          type="number"
          className="mt-1"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          min="1"
          placeholder="Enter an amount"
        />
      </div>

      {/* Comment Input */}
      <div className="px-1 py-1 my-2 bg-gray-100">
        <label>
          <span>Comment</span>
        </label>
        <TextArea
          className="mt-0"
          rows="1"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Rating Input */}
      <div className="px-1 py-1 my-2 mb-3 bg-gray-100">
        <label>Rating</label>
        <br></br>
        <div className="">
          <Rate onChange={(e) => setRating(Number(e))} value={rating} />
        </div>
      </div>

      {/* Submit Button */}
      <div className=" row px-1 py-1 my-2 bg-gray-100 flex justify-end">
        <div className="mr-2 col-2">
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        <div className=" col-2">
          <Button className="ml-5" onClick={handleModalClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

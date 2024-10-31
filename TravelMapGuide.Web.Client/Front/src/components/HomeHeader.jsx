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
import { Modal, Button, Input, Avatar } from "antd";
import {
  PlusOutlined,
  LoginOutlined,
  LogoutOutlined,
  AudioOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../constants/Endpoints";
import "../assets/styles/Home.css";
import { jwtDecode } from "jwt-decode";

const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1677ff",
    }}
  />
);

export default function HomeHeader({ props }) {
  const { isModalVisible, setIsModalVisible, isAuth } = props;
  const token = localStorage.getItem("jwtToken");
  const decodedToken = jwtDecode(token);
  const userImg = decodedToken.userImg;

  const navigate = useNavigate();

  const handleAddClick = () => {
    if (isAuth) {
      setIsModalVisible(true);
    } else {
      navigate("/Login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_ENDPOINTS.DEFAULT_URL}api/User/Logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("jwtToken");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAuthBtnClick = () => {
    if (isAuth) {
      handleLogout();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="header">
      <Avatar
        size={{
          xs: 24,
          sm: 32,
          md: 40,
          lg: 50,
          xl: 50,
          xxl: 55,
        }}
        icon={<AntDesignOutlined />}
      />
      <Search
        placeholder="input search text"
        enterButton="Search"
        size="large"
        suffix={suffix}
        onSearch={""}
      />
      <Button size="large" type="primary" onClick={handleAddClick}>
        Create
      </Button>

      {isAuth && (
        <img
          className="ml-3"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          src={`${API_ENDPOINTS.DEFAULT_URL}img/${userImg}`}
        ></img>
      )}

      <Button
        icon={isAuth ? <LogoutOutlined /> : <LoginOutlined />}
        type="primary"
        size="large"
        className="auth-button"
        onClick={handleAuthBtnClick}
      >
        {isAuth ? "Logout" : "Login"}
      </Button>
    </div>
  );
}

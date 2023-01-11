import React, { useContext } from "react";
import { Button, Col, Row } from "antd";
import { restaurantData } from "../../App";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUserLoggedin, notificationPopup, popupMsg } = useContext(restaurantData);

  const onLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedin(false);
    
    //setting notification pop
    popupMsg.current = "You are logged out!";
    notificationPopup();
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Row>
        <Col span={18}>
          <Row>
            <Col span={8}>
              <h2>Welcome, {user.name}</h2>
              {user?.role === "admin" ? "(Admin)" : ""}
            </Col>
            <Col span={14}>
              <h1>Restaurant Review App</h1>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Button
            type="primary"
            shape="round"
            icon={<LogoutOutlined />}
            onClick={onLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      <br/>
    </React.Fragment>
  );
};

export default Header;

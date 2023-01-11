import React, { useContext, useEffect, useState } from "react";
import {
  InfoCircleOutlined,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Col, Row, Card, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { restaurantData } from "../../App";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, isUserLoggedIn, setUserLoggedin, notificationPopup, popupMsg } = useContext(restaurantData);
  const [isSpinning, setSpinning] = useState<boolean>(false);
  
  const API_URL = "https://task5--backend.herokuapp.com/api/users/";
  
  useEffect(() => {
    if (isUserLoggedIn === true) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isUserLoggedIn]);

  const onFinish = (values: any) => {
    setSpinning(true);
    const userData = {
      email: values.email,
      password: values.password,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };
    fetch(API_URL + "login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setUserLoggedin(true);
        setSpinning(false);

        //setting notification pop
        popupMsg.current = "Login successfull!";
        notificationPopup();
        navigate("/");
      })
      .catch((error) => {
        if (error) {
          
          //setting notification pop
          popupMsg.current = "Incorrent email or Password!";
          notificationPopup();
          setUserLoggedin(false);
          setSpinning(false);
        }
      });
  };

  return (
    <React.Fragment>
      <Spin spinning={isSpinning}>

      <Row>
         <Col span={4}>
        <Button
          type="primary"
          shape="round"
          icon={<UserAddOutlined />}
          onClick={() => navigate(`/register`)}>
          Register
        </Button>
      </Col>
      <Col span={24}>
      <h1><LoginOutlined /> Login to Your Account</h1>

      </Col>
      </Row>
     
      <br />
      <Card>
        <Row>
          <Col span={24}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  prefix={<LockOutlined />}
                  addonAfter={
                    <Tooltip title="password should be min 6 character with MIX of Uppercase, lowercase, digits!">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LoginOutlined />}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
      </Spin>
    </React.Fragment>
  );
};

export default Login;

import React, { useContext, useEffect, useState } from "react";
import { InfoCircleOutlined, LockOutlined, LoginOutlined, MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, Card, Select, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { restaurantData } from "../../App";

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<any>();
  const [email, setEmail] = useState<any>();
  let password_regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const [isPasswordValid, setPasswordValid] = useState<boolean>(false);
  let email_regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [isEmailValid, setEmailValid] = useState<boolean>(false)
  const [isSpinning, setSpinning] = useState<boolean>(false);
  const { setUser, isUserLoggedIn, setUserLoggedin, notificationPopup, popupMsg } =useContext(restaurantData);

  const API_URL = "https://task5--backend.herokuapp.com/api/users/";

  // Email validation
  useEffect(()=>{
    if(email_regex.test(email)){
      setEmailValid(true);
    } else setEmailValid(false)
  },[email])

  // Password validation
  useEffect(() => {
    if (password_regex.test(password)) {
      setPasswordValid(true);
    } else setPasswordValid(false);
  }, [password]);

  useEffect(() => {
    if (isUserLoggedIn===true){
      navigate('/restaurants')
    }
  }, [isUserLoggedIn]);

  const onFinish = (values: any) => {
    setSpinning(true)

    const userData = {
      name: values.username,
      email: values.email,
      password: values.password,
      role: "user",
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };
    fetch(API_URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data))
        setUser(data)
        setUserLoggedin(true)
        setSpinning(false)

         //setting notification pop
         popupMsg.current = "Registration successfull!";
         notificationPopup();
         navigate("/")

      })
      .catch((error) => {
        if (error) {

          //setting notification pop
          popupMsg.current = "Email already registered, Please register with a different email";
          notificationPopup();
          setUserLoggedin(false)
          setSpinning(false)

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
          icon={<LoginOutlined />}
          onClick={() => navigate(`/login`)}
        >
          Login
        </Button>
      </Col>
      <Col span={24}>
      <h1><UserAddOutlined /> Regiter Your Account</h1>

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
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  minLength={6}
                  maxLength={12}
                  placeholder="Enter your username"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  addonAfter={
                    <Tooltip title="Username must be more than 6 characters and less than 12 characters">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>

              <Form.Item
                label="email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  ()=>({
                    validator() {
                      if(isEmailValid){
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error(
                          "email is invalid!"
                        )
                      )
                    }
                  })
                ]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  prefix={<MailOutlined />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}

                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  () => ({
                    validator() {
                      if (isPasswordValid) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "password should be min 6 character with MIX of Uppercase, lowercase, digits!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
           
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<UserAddOutlined />}
                >
                  Register
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

export default Register;

import { LeftCircleFilled } from "@ant-design/icons";
import { Button, Col, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantData } from "../../App";
import User from "./User";

const UserList = () => {
  const [userList, setUserList] = useState<any>([]);
  const { user, isUserLoggedIn} = useContext(restaurantData);
  const [isUserDeleted, setUserDeleted] = useState<number>(1);

  const [isSpinning, setSpinning] = useState<boolean>(true);
  const navigate = useNavigate()

  const URL = "https://task5--backend.herokuapp.com/api/users/";

  useEffect(() => {
    const fetchData = async () => {
      await fetch(URL, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserList(data);
        });
    };
    fetchData();
  }, [user, isUserDeleted]);

  useEffect(() => {
    if (userList.length > 0) {
      setSpinning(false);
    } else setSpinning(true);
  }, [userList]);

  useEffect(() => {
    if (isUserLoggedIn === false) {
      navigate("/login");
    }
  }, [isUserLoggedIn]);
  

 
  return (
    <React.Fragment>
      <Spin spinning={isSpinning}>
          <Row>
          <Col span={4}>
          <Button
            type="primary"
            shape="round"
            icon={<LeftCircleFilled />}
            onClick={() => navigate(`/`)}
          >
            Go Back
          </Button>
        </Col>
          <Col span={16}><h1>User's List</h1></Col>
          </Row>
        {userList.map((user: any) => {
          return (
            <User key={user._id} user={user} setUserDeleted={setUserDeleted} isUserDeleted={isUserDeleted}/>
          );
        })}
      </Spin>
    </React.Fragment>
  );
};

export default UserList;

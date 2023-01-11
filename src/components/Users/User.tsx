import { CheckCircleFilled, DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import React, { FC, useContext, useState } from "react";
import { restaurantData } from "../../App";

const User: FC<{
  user: any;
  setUserDeleted: (value: any) => void;
  isUserDeleted: number;
}> = (props) => {
  const { user, notificationPopup, popupMsg } = useContext(restaurantData);
  const { Option } = Select;
  const [isUserEditable, setUserEditable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [userName, setUserName] = useState<string>(props.user.name);
  const [userEmail, setUserEmail] = useState<string>(props.user.email);
  const [userRole, setUserRole] = useState<string>(props.user.role);

  const URL = "https://task5--backend.herokuapp.com/api/users/";

  console.log(userRole);
  
  // Deleting User
  const deleteHandler = () => {
    fetch(URL + props.user._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then(() => {
      //setting notification pop
      popupMsg.current = "User Deleted Successfully!";
      notificationPopup();

      props.setUserDeleted(props.isUserDeleted + 1);
    });
  };

  // Editing User
  const userEditHandler = () => {
    if (
      userEmail.replace(/\s/g, "").length !== 0 &&
      userName.replace(/\s/g, "").length !== 0
    ) {
      const editedUserDetails = {
        name: userName,
        email: userEmail,
        role: userRole,
      };
      props.user.name = userName;
      props.user.email = userEmail;
      props.user.role = userRole

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(editedUserDetails),
      };
      fetch(URL + props.user._id, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("User Edited"));

      //setting notification pop
      popupMsg.current = "User Edited Successfully!";
      notificationPopup();

      setUserEditable(false);
    }
  };

  return (
    <React.Fragment>
      {isUserEditable ? (
        <Card>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input User's Name!" }]}
            >
              <Input
                addonBefore={"User's Name"}
                defaultValue={userName}
                onChange={(e: any) => setUserName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input User's email!",
                },
              ]}
            >
              <Input
                addonBefore={"User's email"}
                type="email"
                defaultValue={userEmail}
                onChange={(e: any) => setUserEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="select"
              label="Select Role"
              wrapperCol={{ span: 4 }}
              hasFeedback
              rules={[{ required: true, message: "Please select user role!" }]}
            >
              <Select
                placeholder="Please select User role!"
                defaultValue={userRole}
                onChange={(e: any) => setUserRole(e)}
              >
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="role"
              rules={[
                {
                  required: true,
                  message: "Please input User's role!",
                },
              ]}
            >
              <Input
                addonBefore={"User's role"}
                defaultValue={userRole}
                onChange={(e: any) => setUserRole(e.target.value)}
              />
            </Form.Item> */}

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleFilled />}
                onClick={userEditHandler}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button htmlType="button" onClick={() => setUserEditable(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card key={props.user._id}>
          <Row>
            <Col span={8}>Name:{props.user.name}</Col>
            <Col span={8}>
              <Button
                type="primary"
                shape="round"
                icon={<EditFilled />}
                onClick={() => setUserEditable(true)}
              >
                Edit
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                danger
                shape="round"
                icon={<DeleteFilled />}
                onClick={deleteHandler}
              >
                Delete
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>Email: {props.user.email} </Col>
          </Row>
          <Row>
            <Col span={8}>Role: {props.user.role} </Col>
          </Row>
        </Card>
      )}
    </React.Fragment>
  );
};

export default User;

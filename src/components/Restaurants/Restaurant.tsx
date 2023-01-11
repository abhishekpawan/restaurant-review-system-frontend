import { Card, Row, Col, Button, Form, Input, InputNumber } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import React, { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled, CommentOutlined, DeleteFilled, EditFilled, InfoCircleFilled } from "@ant-design/icons";
import { restaurantData } from "../../App";
import TextArea from "antd/lib/input/TextArea";


export interface IRestaurant {
  id: string;
  title: string;
  address: string;
  description: string;
  rating: number;
  reviews: any;
}
export interface IReview {
  id: string;
  user_id: string;
  restaurant_id: string;
  name: string;
  date: string;
  comment: string;
  userRating: number;
}
interface IProps {
  restaurant?: IRestaurant;
}

const Restaurant: FC<IProps> = ({ restaurant = {} }) => {
  const {
    id = 1212,
    title = "Smith LLCGroup",
    address = "34830 Erdman Hollow",
    description = "This is really nice restaurant",
    rating = 4,
    reviews = [],
  } = restaurant;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { restaurantList, setRestaurantList, user, setApiCall, apiCall, notificationPopup, popupMsg } = useContext(restaurantData);
  const [isRestaurantEditable, setRestaurantEditable] = useState<boolean>(false);
  const [restaurantName, setRestaurantName] = useState<string>(title)
  const [restaurantAddress, setRestaurantAdress] = useState<string>(address)
  const [restaurantRating, setRestaurantRating] = useState<number>(rating)
  const [restaurantDescription, setRestaurantDescription] = useState<string>(description)

  const URL = `https://task5--backend.herokuapp.com/api/restaurants/${id}`;


  // Deleting a restaurant
  const deleteHandler = () => {
    fetch(URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then(() => {

      //setting notification pop
      popupMsg.current = "Restaurant Deleted Successfully!";
      notificationPopup();

      setRestaurantList([]);
      setApiCall(apiCall + 1);
    });
  };

  //Editing a restaurant
  const restaurantEditHandler = () => {
    if(restaurantName.replace(/\s/g, "").length !== 0 &&
    restaurantAddress.replace(/\s/g, "").length !== 0 &&
    restaurantRating.toString().replace(/\s/g, "").length !== 0 &&
    restaurantDescription.replace(/\s/g, "").length !== 0){
      const editedRestaurantDetail ={
        id,
        title:restaurantName,
        address:restaurantAddress,
        description:restaurantDescription,
        rating:restaurantRating,
        reviews,  
      }

      //storing the upadeted restaurant details
      for (let i = 0; i < restaurantList.length; i++) {
        if (restaurantList[i].id.toString() === id) {
          restaurantList[i].title = restaurantName
          restaurantList[i].address = restaurantAddress
          restaurantList[i].rating = restaurantRating
          restaurantList[i].description = restaurantDescription
        }
      }

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(editedRestaurantDetail),
      };
      fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("Restaurant Edited"));

      //setting notification pop
      popupMsg.current = "Restaurant Edited Successfully!";
      notificationPopup();

      setRestaurantEditable(false)

    }else {
      //setting notification pop
      popupMsg.current = "Please Enter Valide Inputs!";
      notificationPopup();
    }
  };


  //handling stars according to rating
  let starRating = [];
  if (rating % 1 === 0) {
    for (let i = 0; i < rating; i++) {
      const star = (
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "#08c" }}
          key={i}
        />
      );
      starRating.push(star);
    }
  } else if (rating % 1 !== 0) {
    let decimalRating = (rating + "").split(".");
    for (let j = 0; j < parseInt(decimalRating[0]); j++) {
      const star = (
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "#08c" }}
          key={j}
        />
      );
      starRating.push(star);
    }
    if (parseInt(decimalRating[1]) > 5) {
      starRating.push(
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "#08c" }}
          key={5}
        />
      );
    } else
      starRating.push(
        <FontAwesomeIcon
          icon={faStarHalf}
          style={{ fontSize: "20px", color: "#08c" }}
          key={5}
        />
      );
  }

  return (
    <React.Fragment>
      {isRestaurantEditable ? (
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
              rules={[
                { required: true, message: "Please input Restaurant's Name!" },
              ]}
            >
              <Input 
              addonBefore={"Restaurant's Name"}
              defaultValue={title}
              onChange={(e:any)=>setRestaurantName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input Restaurant's Address!",
                },
              ]}
            >
              <Input 
              addonBefore={"Restaurant's Address"}
              defaultValue={address}
              onChange={(e:any)=>setRestaurantAdress(e.target.value)} 
              />
            </Form.Item>
            <Form.Item
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputNumber
                addonBefore={"Rating"}
                placeholder="Enter restaurant's rating between 1-5"
                min={1}
                max={5}
                style={{ width: "100%" }}
                defaultValue={rating}
                onChange={(e:any)=>setRestaurantRating(e)}
              />
            </Form.Item>

            <Form.Item
              label="description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input restaurant's details!",
                },
              ]}
            >
              <TextArea
                rows={4}
                showCount
                maxLength={500}
                placeholder="Enter restaurant's details"
                defaultValue={description}
                onChange={(e:any)=>setRestaurantDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleFilled />}
                onClick={() => restaurantEditHandler()}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                htmlType="button"
                onClick={() => setRestaurantEditable(false)}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card>
          <Row>
            <Col span={user?.role === "admin" ? 8 : 12}>{title}</Col>
            <Col span={user?.role === "admin" ? 8 : 12}>
              Avg. Rating: {rating}
            </Col>
            {user?.role === "admin" ? (
              <Col span={8}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<EditFilled />}
                  onClick={() => setRestaurantEditable(true)}
                >
                  Edit
                </Button>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <Row>
            <Col span={user?.role === "admin" ? 8 : 12}>Address: {address} </Col>
            <Col span={user?.role === "admin" ? 8 : 12}> {starRating} </Col>
          </Row>
          <br />
          <Row>
            <Col span={user?.role === "admin" ? 8 : 12}>
              <Button
                type="primary"
                shape="round"
                icon={<InfoCircleFilled />}
                onClick={() => navigate(`/restaurantdetails/${id}`)}
              >
                More Details
              </Button>
            </Col>
            <Col span={user?.role === "admin" ? 8 : 12}>
              <Button
                type="primary"
                shape="round"
                icon={<CommentOutlined />}
                onClick={() => navigate(`/restaurantdetails/${id}`)}
              >
                Reviews
              </Button>
            </Col>
            {user?.role === "admin" ? (
              <Col span={user?.role === "admin" ? 8 : 12}>
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
            ) : (
              ""
            )}
          </Row>
        </Card>
      )}
    </React.Fragment>
  );
};
export default Restaurant;

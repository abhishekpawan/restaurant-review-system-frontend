import React, { FC, useContext, useEffect, useState } from "react";
import { Card, Row, Col, Button,Form,InputNumber,Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { IReview } from "../Restaurants/Restaurant";
import { CheckCircleFilled, DeleteFilled, EditFilled } from "@ant-design/icons";
import { restaurantData } from "../../App";
import { useParams } from "react-router-dom";

const Review: FC<{ reviews: IReview; }> = (props) => {
  const [isSpinning, setSpinning] = useState<boolean>(true);
  const { restaurantList, isUserLoggedIn, user, notificationPopup, popupMsg, setApiCall, apiCall, } = useContext(restaurantData);
  const [isReviewEditable, setReviewEditable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [rating, setRating] = useState<number>(props.reviews.userRating);
  const [comment, setComment] = useState<string>(props.reviews.comment);
  const { restaurantID }:any = useParams();

  const URL = `https://task5--backend.herokuapp.com/api/reviews/${props.reviews.id}`;


  useEffect(() => {
    if (props.reviews) {
      setSpinning(false);
    } else setSpinning(true);
  }, [props.reviews]);

  //getting the created date and converting it to normal date
  var date = props.reviews.date.toString();
  var index = date.lastIndexOf(":") + 3;
  const reviewDate = date.substring(0, index);


  //updating the eddited review by the user
  const reviewEditHandler = () => {
    if (rating.toString().replace(/\s/g, "").length !== 0 &&
    comment.replace(/\s/g, "").length !== 0) {
      const editedReviews : IReview={
        id:props.reviews.id,
        user_id:props.reviews.user_id,
        restaurant_id:restaurantID,
        name: user.name,
        date: new Date().toString(),
        comment: comment,
        userRating: rating
      }

      //updating the json-server with the eddited of review
      const requestOptions = {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(editedReviews),
      };
      fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("Review Edited"));

         //setting notification pop
      popupMsg.current = "Review Edited Successfully!";
      notificationPopup();

      setReviewEditable(false);
      setApiCall(apiCall + 1);
    }else {
      //setting notification pop
      popupMsg.current = "Please Enter Valide Inputs!";
      notificationPopup();
    }
  };


  //deleting a review
  const deleteHandler = (id: any) => {
    fetch(`https://task5--backend.herokuapp.com/api/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then(() => {
      //setting notification pop
      popupMsg.current = "Review Deleted Successfully!";
      notificationPopup();

      setApiCall(apiCall + 1);
    });
  };

  //handling stars according to rating
  let starRating = [];
  if (props.reviews.userRating % 1 === 0) {
    for (let i = 0; i < props.reviews.userRating; i++) {
      const star = (
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "lightgreen" }}
          key={i}
        />
      );
      starRating.push(star);
    }
  } else if (props.reviews.userRating % 1 !== 0) {
    let decimalRating = (props.reviews.userRating + "").split(".");
    for (let j = 0; j < parseInt(decimalRating[0]); j++) {
      const star = (
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "lightgreen" }}
          key={j}
        />
      );
      starRating.push(star);
    }
    if (parseInt(decimalRating[1]) > 5) {
      starRating.push(
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "lightgreen" }}
          key={5}
        />
      );
    } else
      starRating.push(
        <FontAwesomeIcon
          icon={faStarHalf}
          style={{ fontSize: "20px", color: "lightgreen" }}
          key={5}
        />
      );
  }

  return (
    <React.Fragment>
      <Spin spinning={isSpinning}>

      <Card>
        {isReviewEditable ? (
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              name="rating"
              rules={[{ required: true, message: "Please input your rating!" }]}
            >
              <InputNumber
                addonBefore={"Rating"}
                placeholder="Enter your rating between 1-5"
                min={1}
                max={5}
                style={{ width: "100%" }}
                defaultValue={props.reviews.userRating}
                onChange={(value: number) => setRating(value)}
              />
            </Form.Item>

            <Form.Item
              label="Review"
              name="review"
              rules={[{ required: true, message: "Please input your review!" }]}
            >
              <TextArea
                rows={4}
                showCount
                maxLength={500}
                placeholder="Enter your review"
                defaultValue={props.reviews.comment}
                onChange={(value: any) => setComment(value.target.value)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                icon={<CheckCircleFilled />}
                onClick={() => reviewEditHandler()}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                htmlType="button"
                onClick={() => {
                  setReviewEditable(false);
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Row>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <h1>{props.reviews.name}</h1>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h3>{reviewDate}</h3>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h2>User Rating: {props.reviews.userRating}</h2>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h1>{starRating}</h1>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Row>
                <Col span={24}>
                  <h3>Review: {props.reviews.comment}</h3>{" "}
                </Col>
              </Row>
              <br />
              <br />
              {(isUserLoggedIn === true && user._id === props.reviews.user_id) || (user?.role==='admin') ? (
                <Row>
                  <Col span={12}>
                    <Button
                      type="primary"
                      htmlType="button"
                      icon={<EditFilled />}
                      onClick={() => setReviewEditable(true)}
                    >
                      Edit
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="primary"
                      danger
                      htmlType="button"
                      icon={<DeleteFilled />}
                      onClick={() => deleteHandler(props.reviews.id)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              ) : (
                " "
              )}
            </Col>
          </Row>
        )}
      </Card>
      </Spin>

    </React.Fragment>
  );
};

export default Review;

import React, { FC, useContext, useState } from "react";
import { InputNumber, Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CheckCircleFilled } from "@ant-design/icons";
import { restaurantData } from "../../App";

const AddReviewForm: FC<{ submitHandler: (value:any) => void }> = (props) => {
  const [form] = Form.useForm();
  const [userRating, setUserRating] = useState<any>();
  const [userComment, setUserComment] = useState<string>();
  const {notificationPopup, popupMsg, } = useContext(restaurantData);


  const onFinish = (values: any) => {
    if (values.rating.toString().replace(/\s/g, "").length !== 0 &&
      values.review.replace(/\s/g, "").length !== 0) {
      props.submitHandler(values);
    } else {
      
      //setting notification pop
      popupMsg.current = "Please Enter Valide Inputs!";
      notificationPopup();
    }
  };


  return (
    <React.Fragment>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
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
            value={userRating}
            onChange={(value: number) => setUserRating(value)}
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
            value={userComment}
            onChange={(value: any) => setUserComment(value.target.value)}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit" icon={<CheckCircleFilled />}>
            Submit
          </Button>
          
        </Form.Item>
        <Form.Item  wrapperCol={{ span: 24 }}>
        <Button htmlType="button" onClick={()=>props.submitHandler([])}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default AddReviewForm;

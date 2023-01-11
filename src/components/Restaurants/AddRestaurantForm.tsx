import React, { FC, useContext} from "react";
import { InputNumber, Button, Input, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CheckCircleFilled } from "@ant-design/icons";
import { restaurantData } from "../../App";

const AddRestaurantForm: FC<{ submitHandler: (value:any) => void }> = (props) => {
  const [form] = Form.useForm();
  const {notificationPopup, popupMsg, } = useContext(restaurantData);

  const onFinish = (values: any) => {
    if (values.name.replace(/\s/g, "").length !== 0 &&
      values.address.replace(/\s/g, "").length !== 0 &&
      values.description.replace(/\s/g, "").length !== 0) {
      console.log(values.name);
      props.submitHandler(values);
    } else {

      //setting notification pop
      popupMsg.current = "Please Enter Valid Inputs!";
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
         name="name"
         rules={[{ required: true, message: "Please input Restaurant's Name!" }]}
         >
        <Input 
         addonBefore={"Restaurant's Name"}
         />
      </Form.Item>
      <Form.Item 
         name="address"
         rules={[{ required: true, message: "Please input Restaurant's Restaurant's Address!" }]}
         >
        <Input 
         addonBefore={"Restaurant's Address"}
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
          />
        </Form.Item>

        <Form.Item
          label="description"
          name="description"
          rules={[{ required: true, message: "Please input restaurant's details!" }]}
        >
          <TextArea
            rows={4}
            showCount 
            maxLength={500}
            placeholder="Enter restaurant's details"
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

export default AddRestaurantForm;

import { IRestaurant } from "./Restaurant";
import Filter from "../Filter/Filter";
import Search from "../Search/Search";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin } from "antd";
import Restaurant from "./Restaurant";
import { restaurantData } from "../../App";
import { EditFilled, UnorderedListOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import AddRestaurantForm from "./AddRestaurantForm";
import Pagination from "../Pagination/Pagination";

const Restaurants= () => {
  const navigate = useNavigate();
  const [isSpinning, setSpinning] = useState<boolean>(true);
  const { restaurantList, user, isUserLoggedIn, notificationPopup, popupMsg,linkHeaders,currentPage, setCurrentPage } = useContext(restaurantData);
  const [restaurantToggle, setRestaurantToggle] = useState<boolean>(false);

  const URL = `https://task5--backend.herokuapp.com/api/restaurants`;

  useEffect(() => {
    if (restaurantList.length > 0) {
      setSpinning(false);
    } else setSpinning(true);
  }, [restaurantList]);


  useEffect(() => {
    if (isUserLoggedIn === false) {
      navigate("/login");
    }
  }, [isUserLoggedIn]);


  //adding a new restaurant by the admin
  const submitHandler = (value:any) => {
    if (value.rating) {
      const enteredRestaurantDetails: IRestaurant = {
        id: uuidv4(),
        title:value.name,
        address:value.address,
        description: value.description,
        rating: value.rating,
        reviews: [],
      };
      restaurantList.unshift(enteredRestaurantDetails)
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(enteredRestaurantDetails),
      };
      fetch(URL, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("Restaurant Added"));

      //setting notification pop
      popupMsg.current = "Restaurant added Successfully!";
      notificationPopup();
  };
  setRestaurantToggle(false)
  }
    

  // Pagination
  const totalPage:string = linkHeaders.last?.split("=")[1]
  useEffect(()=>{
    if(linkHeaders.next){
      setCurrentPage(parseInt(linkHeaders.next?.split("=")[1])-1)
    } else if(linkHeaders.prev){
      setCurrentPage(parseInt(linkHeaders.prev?.split("=")[1])+1)

    }
  },[])

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber)
  
  return (
    <Spin spinning={isSpinning}>
     <Card> <Row>
        
        <Col span={user?.role === "admin" ? 10 : 12}>
          <Filter />
        </Col>
        <Col span={user?.role === "admin" ? 10 : 12}>
        <Search />
        
        </Col>
        {user?.role === "admin" ? (
          <Col span={4}>
              <Button
                type="primary"
                shape="round"
                icon={<UnorderedListOutlined />}
                onClick={() => navigate("/users")}
              >
                User's List
              </Button>
          </Col>
        ) : (
          ""
        )}
      </Row></Card>
      {user?.role === "admin" ? (
        <Card>
          <Col span={24}>
            {restaurantToggle ? (
              <br />
            ) : (
              <Button
                type="primary"
                htmlType="button"
                icon={<EditFilled />}
                onClick={() => setRestaurantToggle(true)}
              >
                Add a Restaurant
              </Button>
            )}
          </Col>

          {restaurantToggle ? (
            <AddRestaurantForm submitHandler={submitHandler} />
          ) : (
            <br />
          )}
        </Card>
      ) : (
        ""
      )}

      {restaurantList.map((restaurant: IRestaurant) => {
        return <Restaurant key={restaurant.id} restaurant={restaurant} />;
      })}
      <Pagination totalPage={totalPage} currentPage={currentPage} paginate={paginate}/>
    </Spin>
  );
};

export default Restaurants;

import { IRestaurant } from "../Restaurants/Restaurant";
import Filter from "./Filter";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import Restaurant from "../Restaurants/Restaurant";
import { restaurantData } from "../../App";
import { useParams } from "react-router-dom";
import Search from "../Search/Search";

const Restaurants = () => {
  const [isSpinning] = useState<boolean>(false);
  const { restaurantList,setRestaurantList,user,} =useContext(restaurantData);
  const { filter } : any = useParams();
  const URL = `https://task5--backend.herokuapp.com/api/restaurants/`;


  useEffect(() => {
    const fetchData = async () => {
     await fetch(URL, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRestaurantList(data);});
    };
    fetchData();
  }, [filter]);

  const filteredList = restaurantList.filter((restaurant: any) => {
    return restaurant.rating >= parseInt(filter);
  });

  let filteredRestaurants: JSX.Element;
  if (filteredList.length ===0) {
    filteredRestaurants = <p>No restaurant found! Please Change Filter</p>;
  } else {
    filteredRestaurants = filteredList.map((restaurant: IRestaurant) => {
      return <Restaurant key={restaurant.id} restaurant={restaurant} />;
    });
  }

  return (
    <Spin spinning={isSpinning}>
      <Card>
        <Row>
          <Col span={12}>
            <Filter />
          </Col>
          <Col span={12}>
            <Search />
          </Col>
        </Row>
      </Card>
      {filteredRestaurants}
    </Spin>
  );
};

export default Restaurants;

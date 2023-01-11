import { IRestaurant } from "../Restaurants/Restaurant";
import Filter from "../Filter/Filter";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import Restaurant from "../Restaurants/Restaurant";
import { restaurantData } from "../../App";
import { useParams } from "react-router-dom";
import Search from "./Search";

const Restaurants = () => {
  const [isSpinning] = useState<boolean>(false);
  const { user } = useContext(restaurantData);
  const { searchValue }: any = useParams();
  const [searchedRestaurants, setSearchedRestaurants] = useState<any>();

  //getting searched restaurant data
  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `https://task5--backend.herokuapp.com/api/restaurants?title_like=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSearchedRestaurants(data);
        });
    };
    fetchData();
  }, [searchValue]);

  let searchRestaurants: JSX.Element;
  if (searchedRestaurants?.length === 0) {
    searchRestaurants = <p>No restaurant found! Please Change Filter</p>;
  } else {
    searchRestaurants = searchedRestaurants?.map((restaurant: IRestaurant) => {
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
      {searchRestaurants}
    </Spin>
  );
};

export default Restaurants;

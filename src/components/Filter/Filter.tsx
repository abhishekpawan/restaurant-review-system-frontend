import { Button, Card, Col,Row, Select } from "antd";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantData } from "../../App";

const Filter = () => {
  const [filterByRating, setFilterByRating] = useState<string>("");
  const { setRestaurantList, apiCall,setApiCall} =useContext(restaurantData);

  const { Option } = Select;
  const navigate = useNavigate();
  const { filter } = useParams();

  const handleChange = (value: string) => {
    setFilterByRating(value);
  };
  
  const filterHandler = () => {
    if (filterByRating !== '') {
      navigate(`/filteredrestaurants/${filterByRating}`)
    }
  };

  const resetFilter = () => {
    setRestaurantList([])
    setApiCall(apiCall+1)
    navigate(`/`)
  };
  
  return (
      <Row>
        <Col span={8}>
          <Select
            placeholder="Filter by rating"
            style={{ width: 150 }}
            onChange={handleChange}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>
        </Col>

        <Col span={8}>
          <Button type={"primary"} onClick={filterHandler}>
            Filter
          </Button>
        </Col>
        <Col span={8}>
          {filter ? (
            <Button type={"dashed"} onClick={resetFilter}>
              Reset Filter
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>
  );
};

export default Filter;

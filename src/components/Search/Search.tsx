import { Button, Card, Col, Input, Row } from "antd";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantData } from "../../App";

const Filter = () => {
  const navigate = useNavigate();
  const { setRestaurantList,notificationPopup, popupMsg } = useContext(restaurantData);
  const { searchValue } = useParams();
  const { Search } = Input;

  const onSearch = (value: string) => {
    if (value.replace(/\s/g, "").length !== 0) {
      navigate(`/searchedrestaurants/${value}`);
    } else {
      //setting notification pop
      popupMsg.current = "Please Enter Valid Search Terms!";
      notificationPopup();
    }
  };

  const resetSearch = () => {
    navigate(`/`);
  };

  return (
      <Row>
        <Col span={16}>
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </Col>

        <Col span={8}>
          {searchValue ? (
            <Button type={"dashed"} onClick={resetSearch}>
              Reset Search
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>
  );
};

export default Filter;

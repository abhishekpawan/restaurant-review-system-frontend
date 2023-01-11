import { Card } from "antd";
import React, { FC, useContext} from "react";
import { useParams } from "react-router-dom";
import { restaurantData } from "../../App";

const Pagination: FC<{
  paginate: (pageNumber: number) => void;
  currentPage: number;
  totalPage:string;
}> = (props) => {
  const { restaurantList,setRestaurantList} = useContext(restaurantData);
  const params = useParams()
  const pageNumbers = [];
  console.log();
  

  for (let i = 1; i <= parseInt(props.totalPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <React.Fragment>
      <Card>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={props.currentPage === number ? "current-page" : ""}
            >
              <button
                onClick={() =>{ 
                  props.paginate(number)
                  if(props.currentPage !== number && params.restaurantID===undefined){
                  setRestaurantList([])}
                
              }}
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </React.Fragment>
  );
};

export default Pagination;

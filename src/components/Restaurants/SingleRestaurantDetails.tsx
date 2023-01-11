import React, { useContext, useEffect, useState } from "react";
import { Card, Row, Col, Button, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantData } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import Review from "../Reviews/Review";
import { IReview } from "./Restaurant";
import AddReviewForm from "../Reviews/AddReviewForm";
import { EditFilled, LeftCircleFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import Pagination from "../Pagination/Pagination";
import ReviewSorting from "../Reviews/ReviewSorting";

const SingleRestaurantDetails = () => {
  const { restaurantID } :any = useParams();
  const navigate = useNavigate();
  const [isSpinning, setSpinning] = useState<boolean>(true);
  const { restaurantList, user, notificationPopup, popupMsg,setApiCall, apiCall, } = useContext(restaurantData);
  const [reviewToggle, setReviewToggle] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [sortReview, setSortReview] = useState<number>(1)
  const [linkHeaders, setLinkHeaders] = useState<any>([]);


  const singleRestaurantDetail = restaurantList.filter(
    (restaurantDetail: any) => {
      return restaurantDetail.id.toString() === restaurantID;
    }
  );

  useEffect(() => {
    if (singleRestaurantDetail.length > 0) {
      setSpinning(false);
    } else setSpinning(true);
  }, [singleRestaurantDetail]);


  //getting reviews of the restaurant
  useEffect(() => {
    setSpinning(true)
    const fetchData = async () => {
     await fetch(`https://task5--backend.herokuapp.com/api/reviews?restaurant_id=${restaurantID}&_page=${currentPage}&_limit=10`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setReviews(data);
        setSpinning(false)});
        
    };
    fetchData();

    function parseLinkHeader( linkHeader:any ) {
      const linkHeadersArray = linkHeader?.split( ", " ).map( (header:any) => header?.split( "; " ) );
      const linkHeadersMap = linkHeadersArray?.map( (header:any) => {
         const thisHeaderRel = header[1]?.replace( /"/g, "" )?.replace( "rel=", "" );
         const thisHeaderUrl = header[0]?.slice( 1, -1 );
         return [ thisHeaderRel, thisHeaderUrl ]
      } );
      return Object.fromEntries( linkHeadersMap );
   }
      fetch( `https://task5--backend.herokuapp.com/api/reviews?restaurant_id=${restaurantID}&_page=${currentPage}&_limit=10`,{
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      } ).then( response => {
         let linkHeaders = parseLinkHeader( response.headers.get( "Link" ) );
         setLinkHeaders(linkHeaders)
        
      } );
  }, [reviewToggle,apiCall,currentPage]);


  //adding a new review by the user
  const submitHandler = (value: any) => {
    if (value.rating) {
      const enteredUserReview: IReview = {
        id: uuidv4(),
        user_id: user._id,
        restaurant_id: restaurantID,
        name: user.name,
        date: new Date().toString(),
        comment: value.review,
        userRating: value.rating,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(enteredUserReview),
      };
      fetch("https://task5--backend.herokuapp.com/api/reviews/", requestOptions)
        .then((response) => response.json())
        .then((data) => console.log("Review Added"));

      //setting notification pop
      popupMsg.current = "Review added Successfully!";
      notificationPopup();
      setApiCall(apiCall+1)
    }

    setReviewToggle(false);
  };

  //handling stars according to rating
  let starRating = [];
  if (singleRestaurantDetail[0]?.rating % 1 === 0) {
    for (let i = 0; i < singleRestaurantDetail[0]?.rating; i++) {
      const star = (
        <FontAwesomeIcon
          icon={faStar}
          style={{ fontSize: "20px", color: "#08c" }}
          key={i}
        />
      );
      starRating.push(star);
    }
  } else if (singleRestaurantDetail[0]?.rating % 1 !== 0) {
    let decimalRating = (singleRestaurantDetail[0]?.rating + "").split(".");
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




  //sorting reviews
    // Highest to Lowest
      const highestToLowest = () => {
      function dynamicSort(userRating: any) {
        var sortOrder = 1;
        if (userRating[0] === "-") {
          sortOrder = -1;
          userRating = userRating.substr(1);
        }
        return function (a: any, b: any) {
          var result =
            a[userRating] > b[userRating] ? -1 : a[userRating] < b[userRating] ? 1 : 0;
          return result * sortOrder;
        };
      }
      reviews?.sort(dynamicSort("userRating"));
      setSortReview(sortReview+1)
      
    };

    // Lowest to Highest 
    const lowestToHighest = () => {
      function dynamicSort(userRating: any) {
        var sortOrder = 1;
        if (userRating[0] === "-") {
          sortOrder = -1;
          userRating = userRating.substr(1);
        }
        return function (a: any, b: any) {
          var result =
            a[userRating] < b[userRating] ? -1 : a[userRating] > b[userRating] ? 1 : 0;
          return result * sortOrder;
        };
      }
      reviews?.sort(dynamicSort("userRating"));
      setSortReview(sortReview+1)
      
    };
  

   // Pagination
  const totalPage:string = linkHeaders.last?.split("=")[2].split("&")[0]
  useEffect(()=>{
    if(linkHeaders.next){
      setCurrentPage(parseInt(linkHeaders.next?.split("=")[2].split("&")[0])-1)
    } else if(linkHeaders.prev){
      setCurrentPage(parseInt(linkHeaders.prev?.split("=")[2].split("&")[0])+1)

    }
  },[])
  console.log(totalPage, currentPage);
   const paginate = (pageNumber:number) => setCurrentPage(pageNumber)
   

   //reviews JSX
   let userReviews : JSX.Element = <p>No review Avaialable</p>
   if(reviews?.length>0){
    userReviews=reviews?.map((reviews: IReview) => {
      return (
        <Review key={reviews?.id} reviews={reviews}  />
      );
    })
   }

  return (
    <React.Fragment>
      <Spin spinning={isSpinning}>
        <Col span={4}>
          <Button
            type="primary"
            shape="round"
            icon={<LeftCircleFilled />}
            onClick={() => navigate(`/`)}
          >
            Go Back
          </Button>
        </Col>
        <br />
        <Col span={4}></Col>
        <br />
        <Card>
          <Row>
            <Col span={12}>
              <h1>{singleRestaurantDetail[0]?.title}</h1>
            </Col>
            <Col span={12}>
              <h1>Avg. Rating: {singleRestaurantDetail[0]?.rating}</h1>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h2>Address: {singleRestaurantDetail[0]?.address}</h2>{" "}
            </Col>
            <Col span={12}> {starRating} </Col>
          </Row>
          <Col span={24}>
            <h3>Restaurant Details:</h3>
          </Col>
          <Col span={24}>
            <h4>{singleRestaurantDetail[0]?.description}</h4>
          </Col>
        </Card>

        <Card>
          <Col span={24}>
            {reviewToggle ? (
              <br />
            ) : (
              <Button
                type="primary"
                htmlType="button"
                icon={<EditFilled />}
                onClick={() => setReviewToggle(true)}
              >
                Add a Review
              </Button>
            )}
          </Col>
          {reviewToggle ? (
            <AddReviewForm submitHandler={submitHandler} />
          ) : (
            <br />
          )}

          <Col span={24}>
            <h2>User Reviews:</h2>
          </Col>
            <br/>
          <Card>
            <ReviewSorting highestToLowest={highestToLowest} lowestToHighest={lowestToHighest}/>
          </Card>
          {userReviews}
          <Pagination totalPage={totalPage} currentPage={currentPage} paginate={paginate}/>
          
        </Card>
      </Spin>
    </React.Fragment>
  );
};

export default SingleRestaurantDetails;

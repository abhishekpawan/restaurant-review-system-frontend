import React, { createContext, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import { message, notification} from "antd";

import Restaurants from "./components/Restaurants/Restaurants";
import SingleRestaurantDetails from "./components/Restaurants/SingleRestaurantDetails";
import FilteredRestaurants from "./components/Filter/FilteredRestaurants";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Header from "./components/Header/Header";
import UserList from "./components/Users/UserList";
import SearchRestaurants from "./components/Search/SearchRestaurants";

export const restaurantData = createContext<any>(null);

export default function App() {
  const [restaurantList, setRestaurantList] = useState<any>([]);
  const [linkHeaders, setLinkHeaders] = useState<any>([]);
  const [apiCall, setApiCall] = useState<any>(0);
  const [error, setError] = useState<any>();
  const popupMsg = useRef<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1)
  const userData: any = JSON.parse(localStorage.getItem("user")!);
  const [user, setUser] = useState<any>(userData ? userData : null);
  const [isUserLoggedIn, setUserLoggedin] = useState<boolean>( user ? true : false );

  const URL = `https://task5--backend.herokuapp.com/api/restaurants?_page=${currentPage}`;


  //getting restaurant data
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

  function parseLinkHeader( linkHeader:any ) {
    const linkHeadersArray = linkHeader.split( ", " ).map( (header:any) => header.split( "; " ) );
    const linkHeadersMap = linkHeadersArray.map( (header:any) => {
       const thisHeaderRel = header[1].replace( /"/g, "" ).replace( "rel=", "" );
       const thisHeaderUrl = header[0].slice( 1, -1 );
       return [ thisHeaderRel, thisHeaderUrl ]
    } );
    return Object.fromEntries( linkHeadersMap );
 }
    fetch( URL,{
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    } ).then( response => {
       let linkHeaders = parseLinkHeader( response.headers.get( "Link" ) );
       setLinkHeaders(linkHeaders)
      
    } );
  }, [isUserLoggedIn, user,apiCall,currentPage]);
  
  const notificationPopup = () => {
    // message.open({
    //   type: "info",
    //   content: `${popupMsg.current}`,
    //   duration: 2,
    // });
    notification.info({
      message: `${popupMsg.current}`,
      // description:
      //   'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };


  return (
    <React.Fragment>
      <restaurantData.Provider
        value={{
          restaurantList, setRestaurantList,
          error, setError,
          user, setUser,
          isUserLoggedIn, setUserLoggedin,
          popupMsg, notificationPopup,
          apiCall, setApiCall,
          currentPage,setCurrentPage,
          linkHeaders,
        }}
      >
        <div className="App">
          {isUserLoggedIn ? <Header /> : ""}
          <Routes>
            <Route path="/" element={<Restaurants />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurantdetails/:restaurantID" element={<SingleRestaurantDetails />}/>
            <Route path="/filteredrestaurants/:filter" element={<FilteredRestaurants />} />
            <Route path="/searchedrestaurants/:searchValue" element={<SearchRestaurants />} />
            {user?.role === "admin" ? (
              <Route path="/users" element={<UserList />} />
            ) : (
              ""
            )}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </restaurantData.Provider>
    </React.Fragment>
  );
}

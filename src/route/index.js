import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import DisplayContainer from "../components/DisplayContainer";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import React from "react";

export const AppNavigation = () => {
  //   const params = useParams();
  //   useEffect(() => {
  //     setUser(sessionStorage.getItem("access_token"));
  //   }, [params]);
  
  return (
    <Router>
        <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div id="mainCont">
                <SideBar />
              </div>
              <DisplayContainer />

            </>
          }
        />
        <Route
          path="/path/:currentParh"
          element={
            <>
              <Navbar />
              <div id="mainCont">
                <SideBar />
              </div>
              <DisplayContainer />

            </>
          }
        />
      </Routes>
    </Router>
  );
};

import React, {  useEffect, useState } from "react";
import axios from "axios";

import "../css/DisplayContainer.css";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useNavigate, useParams } from "react-router-dom";
import DriveListView from "./ListFile";
import DriveList from "./ListFile";
import { getFileStructure } from "../api/file";


export default function DisplayContainer() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate()
  const params = useParams()
  const currentParh = params.currentParh
  useEffect(()=>{
    const user_token = sessionStorage.getItem("access_token")
    if(!user_token) navigate('/login')
  })
 
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", files[0]);

    axios
      .post("http://localhost:4000/upload", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    
    <>
      
      <Navbar id="navbar"/>
      <div id="mainCont">
      
        <SideBar id="sideBar" />
          <div id="displayCont">  
            <DriveList />
          </div>
      </div>
    </>
  );
    
}

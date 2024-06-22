import React, {useState,useEffect} from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Homepagebutton from './Homepagebutton';
function Home() {
    const navigate = useNavigate();
  return (
    <> <Navbar/>
    <Homepagebutton/>
    </>
  )

}
export default Home;
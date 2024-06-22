import React, {useState,useEffect} from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';
import "./Homepagebutton.css";
function Homepagebutton(){
    const navigate = useNavigate();
    return(
    <div className='Homepagediv'>
      <div className=''>
      <div className="">
        <h1>Complaint Registration</h1>
            <div class="btn-group">
                <button onClick={ () => navigate("/add-item")}>In Shop Repair</button>
                <button onClick={ () => navigate("/add-itemInternet")}>Internet Services</button>
                <button onClick={ () => navigate("/view")}>View Complaints</button>
            </div>
    </div>
    </div>
    </div>
    )
}

export default Homepagebutton
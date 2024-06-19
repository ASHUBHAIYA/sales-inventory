import React, {useState,useEffect} from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <div>

        <h1>Home</h1>
        <button className='button1' onClick={ () => navigate("/view")}>View All issue</button> <br />
        <button className='button1' onClick={ () => navigate("/add-item")}>Add New issue</button>
    </div>
  )

}
export default Home;
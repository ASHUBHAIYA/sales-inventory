import React, {useState} from 'react';
import app from "../firebase";
import {getDatabase, ref, get, remove  } from "firebase/database";
import { useNavigate } from 'react-router-dom';

function DeleteInventoryItem() {

   const navigate = useNavigate();
  
   let [clientArray, setClientArray] = useState([]);
  
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "nature/client");
      const snapshot = await get(dbRef);
      if(snapshot.exists()) {
  
          const myData = snapshot.val();
          const  temporaryArray= Object.keys(myData).map( myFireId => {
              return {
                  ...myData[myFireId],
                  clientId: myFireId
              }
          } )
          setClientArray(temporaryArray);
      } else {
        alert("error");
      }
    }
  
    const deleteClient = async (clientIdParam) => {
      const db = getDatabase(app);
      const dbRef = ref(db, "nature/client/"+clientIdParam);
      await remove(dbRef);
      window.location.reload();
    }
  
    return (
        
    <div>
    <h1>READ</h1>
    <button onClick={fetchData}> Display Data </button>
    <ul>
      {clientArray.map( (item, index) => (
        <li key={index}> 
          {item.clientDetail}: {item.clientName} : {item.clientId}
          <button className='button1' onClick={ () => navigate(`/edit-item/${item.clientId}`)}>UPDATE</button>
          <button className='button1' onClick={ () => deleteClient(item.clientId)}>Delete</button> <br />
        </li>
      ) )}
    </ul>
    <button className='button1' onClick={ () => navigate("/")}>GO HOMEPAGE</button> <br />
      <button className='button1' onClick={ () => navigate("/read")}>GO READ PAGE</button>

  </div>
    )
  }
  
  export default DeleteInventoryItem
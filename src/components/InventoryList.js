import React, {useState, useEffect} from 'react';
import app from "../firebase";
import { getDatabase, ref, get, limitToFirst} from "firebase/database";
import { useNavigate } from 'react-router-dom';
//import { db } from '../firebase/config';

function InventoryList () {
  const navigate = useNavigate();

  let [clientArray, setClientArray] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
    const db = getDatabase(app);
    const dbRef = ref(db, "nature/client", limitToFirst(100));
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setClientArray(Object.values(snapshot.val()));
    } else {
      alert("Error: No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>READ</h1>
      <ul>
        {clientArray.map( (item, index) => (
          <li key={index}> 
            {item.clientDetail}: {item.clientName}
          </li>
        ) )}
      </ul>
      <br />
      <br />
      <button className='button1' onClick={ () => navigate("/add-item")}>Add Issue</button> <br />
    </div>
  )
}

export default InventoryList

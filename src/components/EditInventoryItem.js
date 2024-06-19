import React, {useState,useEffect} from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';

function EditInventoryItem() {

  const navigate = useNavigate();
  const {firebaseId} = useParams();

  let [inputValue1, setInputValue1] = useState("");
  let [inputValue2, setInputValue2] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "nature/client/"+firebaseId);
            const snapshot = await get(dbRef);
            if(snapshot.exists()) {
              const targetObject = snapshot.val();
              setInputValue1(targetObject.clientName);
              setInputValue2(targetObject.clientDetail);
            } else {
              alert("error");
            }
        }
        fetchData();
    }, [firebaseId])
    

  const overwriteData = async () => {
    const db = getDatabase(app);
    const newDocRef = ref(db, "nature/client/"+firebaseId);
    set(newDocRef, {
        clientName: inputValue1,
        clientDetail: inputValue2
    }).then( () => {
      alert("data updated successfully")
    }).catch((error) => {
      alert("error: ", error.message);
    })
  }


  return (
    <div>

      <h1>UPDATE</h1>

      <input type='text' value={inputValue1} 
      onChange={(e) => setInputValue1(e.target.value)}/> 

      <input type='text' value={inputValue2} 
      onChange={(e) => setInputValue2(e.target.value)}/> <br/>

      <button onClick={overwriteData}>UPDATE</button>
      <br />
      <br />
      <br />
      <button className='button1' onClick={ () => navigate("/updateread")}>GO UPDATE READ</button> <br />
      <button className='button1' onClick={ () => navigate("/read")}>GO READ PAGE</button>
    </div>
  )
}

export default EditInventoryItem;
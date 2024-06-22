import React, { useState, useEffect } from 'react';
import app from "../firebase";
import { getDatabase, ref, get, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/styles/App.css';
function InventoryList() {
  const [clientArray, setClientArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTypeofIssue, setFilterTypeofIssue] = useState('');


  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "nature/client");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setClientArray(dataArray);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilterTypeofIssue(e.target.value);
  };

  const filteredClientArray = clientArray.filter(item => {
    if (filterTypeofIssue === '') {
      return true; // No filter applied
    } else {
      return item.TypeofIssue === filterTypeofIssue;
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  const deleteClient = async (clientIdParam) => {
    const db = getDatabase(app);
    const dbRef = ref(db, "nature/client/"+clientIdParam);
    await remove(dbRef);
    window.location.reload();
  }
  const handleUpdate = (item) => {
    let path;
    switch (item.TypeofIssue) {
      case "Internet service down":
        path = `/edit-item/${item.id}`;
        break;
      case "Internet New Connection":
        path = `/edit-item/${item.id}`;
        break;
      case "Laptop Repair":
          path = `/edit-itemshop/${item.id}`;
          break;
      case "Desktop Repair":
          path = `/edit-itemshop/${item.id}`;
          break;
      case "Printer Repair":
            path = `/edit-itemshop/${item.id}`;
        break;
      case "Tonner Refilling":
            path = `/edit-itemshop/${item.id}`;
            break;
                
      default:
        path = `/edit-item/${item.id}`;
    }
    navigate(path);
  };
  return (
    <>
      <Navbar />
      <div className="filter-container">
        <label>Filter by Issue </label>
        <select id="inputState" 
          
          className="form-group col-md-2"
          value={filterTypeofIssue} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Internet service down">Internet service down</option>
          <option value="Internet New Connection">Internet New Connection</option>
          <option value="Laptop Repair">Laptop Repair</option>
          <option value="Desktop Repair">Desktop Repair</option>
          <option value="Printer Repair">Printer Repair</option>
          <option value="Tonner Refilling">Tonner Refilling</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Type of Issue</th>
              <th>Client Name</th>
              <th>Client Address</th>
              <th>Client City</th>
              <th>Client State</th>
              <th>Client Mobile</th>
              <th>Issue Description</th>
              <th>Remark</th>
              <th>Device Brand</th>
              <th>Model</th>
              <th>Service Type</th>
              <th>Items Received</th>
              <th>Device Condition</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredClientArray.map((item) => (
              <tr key={item.id}>
                <td>{item.TypeofIssue}</td>
                <td>{item.ClientName}</td>
                <td>{item.ClientAddress}</td>
                <td>{item.ClientCity}</td>
                <td>{item.ClientState}</td>
                <td>{item.ClientMobile}</td>
                <td>{item.IssueDesc}</td>
                <td>{item.Remark}</td>
                <td>{item.DeviceBrand}</td>
                <td>{item.Model}</td>
                <td>{item.ServiceType}</td>
                <td>{item.ItemsReceived}</td>
                <td>{item.DeviceCondition}</td>
                <button className='button1' onClick={() => handleUpdate(item)}>UPDATE</button>
                <td><button className='button1' onClick={ () => deleteClient(item.id)}>Delete</button></td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default InventoryList;

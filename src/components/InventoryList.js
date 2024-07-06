import React, { useState, useEffect } from 'react';
import app from "../firebase";
import { getDatabase, ref, get, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/styles/App.css';
import { auth } from '../firebase';
import { Button, Modal } from 'react-bootstrap';

function InventoryList() {
  const [clientArray, setClientArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTypeofIssue, setFilterTypeofIssue] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  const navigate = useNavigate();

  // Helper function to parse the custom date format
  const parseDate = (dateStr) => {
    const [day, month, year, hours, minutes, seconds] = dateStr.split(/[-\s:]/);
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
        console.log("User Email Address" + userEmail);

        const db = getDatabase(app);
        const dbRef = ref(db, "nature/client");
        const usRef = ref(db, "auth/client");
        const ussnapshot = await get(usRef);
        if (ussnapshot) {
          const data = ussnapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          dataArray.forEach(obj => {
            if (obj.email === userEmail) {
              if (obj.auth === "admin") {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            }
          });
        } else {
          console.error("No data found in the snapshot");
        }

        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          dataArray.sort((a, b) => parseDate(b.updatedAt) - parseDate(a.updatedAt));
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

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredClientArray = clientArray.filter(item => {
    const matchesTypeofIssue = filterTypeofIssue === '' || item.TypeofIssue === filterTypeofIssue;
    const matchesDate = filterDate === '' || parseDate(item.updatedAt).toLocaleDateString() === new Date(filterDate).toLocaleDateString();
    const matchesStatus = filterStatus === '' || item.Status === filterStatus;
    return matchesTypeofIssue && matchesDate && matchesStatus;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (clientId) => {
    setClientIdToDelete(clientId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "nature/client/" + clientIdToDelete);
    try {
      await remove(dbRef);
      setClientArray(prevArray => prevArray.filter(client => client.id !== clientIdToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleUpdate = (item) => {
    let path;
    switch (item.TypeofIssue) {
      case "Internet service down":
      case "Internet New Connection":
        path = `/edit-item/${item.id}`;
        break;
      case "Laptop Repair":
      case "Desktop Repair":
      case "Printer Repair":
      case "Tonner Refilling":
        path = `/edit-itemshop/${item.id}`;
        break;
      default:
        path = `/edit-item/${item.id}`;
    }
    navigate(path);
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  return (
    <>
      <Navbar />
      <div className="filter-container">
        <label>Filter by Issue </label>
        <select
          id="inputState"
          className="form-group col-md-2 filterclass"
          value={filterTypeofIssue}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Internet service down">Internet service down</option>
          <option value="Internet New Connection">Internet New Connection</option>
          <option value="Laptop Repair">Laptop Repair</option>
          <option value="Desktop Repair">Desktop Repair</option>
          <option value="Printer Repair">Printer Repair</option>
          <option value="Tonner Refilling">Tonner Refilling</option>
        </select>
        
        <label>Filter by Status </label>
        <select
          id="inputState"
          className="form-group col-md-2 filterclass"
          value={filterStatus}
          onChange={handleStatusChange}
        >
          <option value="">All</option>
          <option value="Created">Created</option>
          <option value="In progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="card-body">
        <div className="tableclassDiv table-bordered">
          <table className="tableclass">
            <thead className="tablehead">
              <tr>
                <th>Type of Issue</th>
                <th>Name</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>Issue</th>
                <th>Remark</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Service Type</th>
                <th>Items Received</th>
                <th>Device Condition</th>
                <th>Status</th>
                <th></th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filteredClientArray.map((item) => (
                <tr key={item.id}>
                  <td>{item.TypeofIssue}</td>
                  <td>{item.ClientName}</td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.ClientAddress, 15)}
                    </span>
                    {item.ClientAddress.length > 15 && (
                      <span className="full-text">{item.ClientAddress}</span>
                    )}
                  </td>
                  <td>{item.ClientMobile}</td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.IssueDesc, 15)}
                    </span>
                    {item.IssueDesc.length > 15 && (
                      <span className="full-text">{item.IssueDesc}</span>
                    )}
                  </td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.Remark, 15)}
                    </span>
                    {item.Remark.length > 15 && (
                      <span className="full-text">{item.Remark}</span>
                    )}
                  </td>
                  <td>{item.laptopBrand}</td>
                  <td>{item.Model}</td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.ServiceType, 15)}
                    </span>
                    {item.ServiceType.length > 15 && (
                      <span className="full-text">{item.ServiceType}</span>
                    )}
                  </td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.ItemsReceived, 15)}
                    </span>
                    {item.ItemsReceived.length > 15 && (
                      <span className="full-text">{item.ItemsReceived}</span>
                    )}
                  </td>
                  <td>
                    <span className="truncated-text">
                      {truncateText(item.DeviceCondition, 15)}
                    </span>
                    {item.DeviceCondition.length > 15 && (
                      <span className="full-text">{item.DeviceCondition}</span>
                    )}
                  </td>
                  <td>{item.Status}</td>
                  <td><button onClick={() => handleUpdate(item)} className="fa fa-pencil" aria-hidden="true"></button></td>
                  {isAdmin && <td><button className='fa fa-trash' onClick={() => handleDelete(item.id)}></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InventoryList;

// src/components/Tasks.js
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import '../assets/styles/App.css';
const Tasks = () => {
  const [clientArray, setClientArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
        if (userEmail) {
          const dbRef = ref(db, "nature/client");
          const snapshot = await get(dbRef);
          const data = snapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          if (dataArray) {
            // Sort the dataArray based on AssignedUser property
            dataArray.sort((a, b) => {
                if (a.AssignedUser < b.AssignedUser) {
                    return -1;
                }
                if (a.AssignedUser > b.AssignedUser) {
                    return 1;
                }
                return 0;
            });
        
            // Filter and update the state
            const filteredArray = dataArray.filter(obj => obj.AssignedUser === userEmail);
            setClientArray(filteredArray);
          }
        } else {
          setError('User is not logged in');
        }
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [auth, db]);

  return (
    <>
      <Navbar />
    
      <div className="filter-container">
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <table class="">
                  <thead class="tablehead">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Mobile</th>
                <th>Device Condition</th>
                <th>Description</th>
                <th>Items Received</th>
                <th>Model</th>
                <th>Remark</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Type of Issue</th>
                <th>Laptop Brand</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {clientArray.map(task => (
                <tr key={task.id}>
                  <td>{task.ClientName}</td>
                  <td>{task.ClientAddress}</td>
                  <td>{task.ClientCity}</td>
                  <td>{task.ClientMobile}</td>
                  <td>{task.DeviceCondition}</td>
                  <td>{task.IssueDesc}</td>
                  <td>{task.ItemsReceived}</td>
                  <td>{task.Model}</td>
                  <td>{task.Remark}</td>
                  <td>{task.ServiceType}</td>
                  <td>{task.Status}</td>
                  <td>{task.TypeofIssue}</td>
                  <td>{task.LaptopBrand}</td>
                  <td>{task.updatedAt}</td>
                </tr>
              ))}
            </tbody>
            </table>
        )}
        </div>
    </>
  );
};

export default Tasks;

import React, { useState, useEffect } from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import "./AddInventoryItemInternet.css";
function EditInventoryItem() {
  const navigate = useNavigate();
  const { firebaseId } = useParams();

  const [loading, setLoading] = useState(true); // Loading state

  const [selectedTypeofIssue, setTypeofIssue] = useState('');
  const [selectedClientName, setClientName] = useState('');
  const [selectedClientAddress, setClientAddress] = useState('');
  const [selectedClientCity, setClientCity] = useState('');
  const [selectedClientMobile, setClientMobile] = useState('');
  const [selectedIssueDesc, setIssueDesc] = useState('');
  const [selectedRemark, setRemark] = useState('');
  const [selectedDeviceBrand, setSelectedDeviceBrand] = useState('');
  const [selectedModel, setModel] = useState('');
  const [selectedServiceType, setServiceType] = useState('');
  const [selectedItemsReceived, setItemsReceived] = useState('');
  const [selectedDeviceCondition, setDeviceCondition] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [status, setStatus] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [assignedUserV, setAssignedUserV] = useState('');
  const [mandatoryFieldError, setMandatoryFieldError] = useState(false);

  const Issues = [
    'Internet service down', 'Internet New Connection'
    // Add more issues as needed
  ];
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const userEmail = auth.currentUser ? auth.currentUser.email : null;
        console.log("User Email Address" + userEmail )

        const db = getDatabase(app);
        const dbRef = ref(db, "nature/client/" + firebaseId);
        const usRef = ref(db, "auth/client");
        const ussnapshot = await get(usRef);
        if (ussnapshot) {
          // Iterate over each child node under `auth/client`
          const data = ussnapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          dataArray.forEach(obj => {
            if (obj.email === userEmail) {
                if (obj.auth === "admin"){
                  setIsAdmin(true); // Set state to true if user is admin
              } else {
                setIsAdmin(false); // Set state to false if user is not admin
              }
            } 
          
        });
          
      } else {
          console.error("No data found in the snapshot");
      }

        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
          const targetObject = snapshot.val();


          const data = ussnapshot.val();
          const dataArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          dataArray.forEach(obj => {
            if (obj.email === targetObject.AssignedUser) {
                setAssignedUserV(obj.name)
                console.log("Assigner user logged  "+targetObject.AssignedUser+' '+obj.name )
            } 
          
        });


          setTypeofIssue(targetObject.TypeofIssue || '');
          setClientName(targetObject.ClientName || '');
          setClientAddress(targetObject.ClientAddress || '');
          setClientCity(targetObject.ClientCity || '');
          setClientMobile(targetObject.ClientMobile || '');
          setIssueDesc(targetObject.IssueDesc || '');
          setRemark(targetObject.Remark || '');
          setSelectedDeviceBrand(targetObject.laptopBrand || '');
          setModel(targetObject.Model || '');
          setServiceType(targetObject.ServiceType || '');
          setItemsReceived(targetObject.ItemsReceived || '');
          setDeviceCondition(targetObject.DeviceCondition || '');
          setStatus(targetObject.Status || '');
          setAssignedUser(targetObject.AssignedUser || '');
        } else {
          alert("Client data not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchData();
  }, [firebaseId]);

  const overwriteData = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check for empty mandatory fields
    if (
      !selectedTypeofIssue || !selectedClientName || !selectedClientAddress ||
      !selectedClientCity ||
      !selectedClientMobile || !selectedIssueDesc 
    ) {
      setMandatoryFieldError(true); // Show error message for mandatory fields
      setTimeout(() => {
        setMandatoryFieldError(false); // Automatically close error message after 3 seconds
      }, 3000);
      return;
    }

    try {
      const db = getDatabase(app);
      const dbRef = ref(db, "nature/client/" + firebaseId);
      await set(dbRef, {
        TypeofIssue: selectedTypeofIssue,
        ClientName: selectedClientName,
        ClientAddress: selectedClientAddress,
        ClientCity: selectedClientCity,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,
        Remark: selectedRemark,
        laptopBrand: selectedDeviceBrand,
        Model: selectedModel,
        ServiceType: selectedServiceType,
        ItemsReceived: selectedItemsReceived,
        DeviceCondition: selectedDeviceCondition,
        updatedAt: updateDate,
        AssignedUser: assignedUser
      });
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => {
        setShowSuccessMessage(false); // Automatically close success message after 3 seconds
        navigate("/view");  
      }, 2000);
      clearFields(); // Clear fields after successful save
    } catch (error) {
      setShowErrorMessage(true); // Show error message
      setTimeout(() => {
        setShowErrorMessage(false); // Automatically close error message after 3 seconds
      }, 3000);
    }
  };
 
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  const updateDate = formatDate(new Date());


  const progress = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check for empty mandatory fields
    if (
      !selectedTypeofIssue || !selectedClientName || !selectedClientAddress ||
      !selectedClientCity || 
      !selectedClientMobile || !selectedIssueDesc 
    ) {
      setMandatoryFieldError(true); // Show error message for mandatory fields
      setTimeout(() => {
        setMandatoryFieldError(false); // Automatically close error message after 3 seconds
      }, 3000);
      return;
    }

    try {
      const db = getDatabase(app);
      const dbRef = ref(db, "nature/client/" + firebaseId);
      await set(dbRef, {
        TypeofIssue: selectedTypeofIssue,
        ClientName: selectedClientName,
        ClientAddress: selectedClientAddress,
        ClientCity: selectedClientCity,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,
        Remark: selectedRemark,
        laptopBrand: selectedDeviceBrand,
        Model: selectedModel,
        ServiceType: selectedServiceType,
        Status: 'IN Progress',
        ItemsReceived: selectedItemsReceived,
        DeviceCondition: selectedDeviceCondition,
        updatedAt: updateDate,
        AssignedUser: assignedUser
      });
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => {
        setShowSuccessMessage(false); // Automatically close success message after 3 seconds
        navigate("/view");
      }, 2000);
      clearFields(); // Clear fields after successful save
    } catch (error) {
      setShowErrorMessage(true); // Show error message
      setTimeout(() => {
        setShowErrorMessage(false); // Automatically close error message after 3 seconds
      }, 3000);
    }
  };

  const completed = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check for empty mandatory fields
    if (
      !selectedTypeofIssue || !selectedClientName || !selectedClientAddress ||
      !selectedClientCity || 
      !selectedClientMobile || !selectedIssueDesc 
    ) {
      setMandatoryFieldError(true); // Show error message for mandatory fields
      setTimeout(() => {
        setMandatoryFieldError(false); // Automatically close error message after 3 seconds
      }, 3000);
      return;
    }

    try {
      const db = getDatabase(app);
      const dbRef = ref(db, "nature/client/" + firebaseId);
      await set(dbRef, {
        TypeofIssue: selectedTypeofIssue,
        ClientName: selectedClientName,
        ClientAddress: selectedClientAddress,
        ClientCity: selectedClientCity,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,
        Remark: selectedRemark,
        laptopBrand: selectedDeviceBrand,
        Model: selectedModel,
        ServiceType: selectedServiceType,
        Status: 'Completed',
        ItemsReceived: selectedItemsReceived,
        DeviceCondition: selectedDeviceCondition,
        updatedAt: updateDate,
        AssignedUser: assignedUser
      });
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => {
        setShowSuccessMessage(false); // Automatically close success message after 3 seconds
        navigate("/view");
      }, 2000);
      clearFields(); // Clear fields after successful save
    } catch (error) {
      setShowErrorMessage(true); // Show error message
      setTimeout(() => {
        setShowErrorMessage(false); // Automatically close error message after 3 seconds
      }, 3000);
    }
  };

  const clearFields = () => {
    setTypeofIssue('');
    setClientName('');
    setClientAddress('');
    setClientCity('');
    setClientMobile('');
    setIssueDesc('');
    setRemark('');
    setSelectedDeviceBrand('');
    setModel('');
    setServiceType('');
    setItemsReceived('');
    setDeviceCondition('');
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  const handleMobileChange = (e) => {
    const mobileNumber = e.target.value;
    setClientMobile(mobileNumber); // Update input value

    // Validate mobile number
    if (/^\d{10}$/.test(mobileNumber)) {
      setIsValidMobile(true);
      setShowErrorMessage(false); // Remove error message on valid input
    } else {
      setIsValidMobile(false);
    }
  };

  const handleAssignUser = async () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : null;
    setAssignedUser(userEmail);

    const db = getDatabase(app);
    const dbRef = ref(db, "nature/client/" + firebaseId);
    await set(dbRef, {
      TypeofIssue: selectedTypeofIssue,
      ClientName: selectedClientName,
      ClientAddress: selectedClientAddress,
      ClientCity: selectedClientCity,
      ClientMobile: selectedClientMobile,
      IssueDesc: selectedIssueDesc,
      Remark: selectedRemark,
      laptopBrand: selectedDeviceBrand,
      Model: selectedModel,
      ServiceType: selectedServiceType,
      ItemsReceived: selectedItemsReceived,
      DeviceCondition: selectedDeviceCondition,
      updatedAt: updateDate,
      AssignedUser: userEmail
    });
    window.location.reload();
    const asdbRef = ref(db, "nature/Assigned/" + firebaseId);
    await set(asdbRef, {
      FirebaseId: firebaseId,
      AssignedUser: userEmail
    });

  };


  return (
    <>
      <Navbar />

      <div className='editInv'>
        <form className="formclass" onSubmit={overwriteData}>
          <div className="form-group">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Type of issue<span className="mandatory">*</span></label>
                <select 
                  id="inputState" 
                  className="form-control"

                  value={selectedTypeofIssue}  // Ensure value is always defined
                  onChange={(e) => setTypeofIssue(e.target.value)}
                >
                  <option value="" disabled>Choose...</option>
                  {Issues.map(issue => (
                    <option key={issue} value={issue}>{issue}</option>
                  ))}
                </select>
              </div>
              <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
                <label>Issue Description<span className="mandatory">*</span></label>
                <input
                  type="text"
                  value={selectedIssueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="Describe Issue"
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-row">
              <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
                <label>Client Name<span className="mandatory">*</span></label>
                <input
                  type="text"
                  value={selectedClientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="form-control"
                />
              </div>
              <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
                <label>Remark</label>
                <input
                  type="text"
                  value={selectedRemark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter Remark"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Address<span className="mandatory">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              value={selectedClientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter Address"
            />
          </div>
          <div className="form-row">
           
            <div className="form-group col-md-4">
              <label>City<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedClientCity}
                onChange={(e) => setClientCity(e.target.value)}
              />
            </div>
            
          </div>
          <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
            <label>Mobile<span className="mandatory">*</span></label>
            <input
              type="text"
              value={selectedClientMobile}
              onChange={handleMobileChange}
              placeholder="Mobile"
              className={`form-control ${isValidMobile ? '' : 'invalid'}`}
            />
            {!isValidMobile && <p className="error-message">Please enter a 10-digit number</p>}
          </div>
          
          <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
            <label>Assigned User<span className="mandatory">*</span></label>
            <input
              type="text"
              value={assignedUserV}
              placeholder="Assigned User"
              className={`form-control ${isValidMobile ? '' : 'invalid'}`} readOnly
            />
            {!isValidMobile && <p className="error-message">Please enter a 10-digit number</p>}
          </div>
          {isAdmin && (
          <div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={clearFields}>Clear</button>
          <button type="button" className="btn btn-secondary" onClick={handleAssignUser}>Assign</button>
          
              <button type="button" className="btn btn-secondary" onClick={progress}>In Progress</button>
              <button type="button" className="btn btn-secondary" onClick={completed}>Completed</button>
            </div>
          )}

{!isAdmin && (status === 'In progress' || status === 'Created' || status === '')&& (
          <div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={clearFields}>Clear</button>
          <button type="button" className="btn btn-secondary" onClick={handleAssignUser}>Assign</button>
              <button type="button" className="btn btn-secondary" onClick={progress}>In Progress</button>
              <button type="button" className="btn btn-secondary" onClick={completed}>Completed</button>
            </div>
          )}


        </form>
        {showSuccessMessage && (
          <div className="message success-message">
            <p>Data saved successfully!</p>
            <button onClick={() => setShowSuccessMessage(false)}>Close</button>
          </div>
        )}
        {showErrorMessage && (
          <div className="message error-message">
            <p>Failed to save data. Please try again.</p>
            <button onClick={() => setShowErrorMessage(false)}>Retry</button>
          </div>
        )}
        {mandatoryFieldError && (
          <div className="message error-message">
            <p>Please enter all mandatory fields.</p>
            <button onClick={() => setMandatoryFieldError(false)}>Close</button>
          </div>
        )}
      </div>




     
    </>
  );
}

export default EditInventoryItem;

import React, { useState } from 'react';
import app from "../firebase";
import { getDatabase, ref, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Homepagebutton from './Homepagebutton';
import "./AddInventoryItemInternet.css";

function AddInventoryItemInternet() {
  const navigate = useNavigate();
  
  const laptopBrands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 
    'Samsung', 'Sony', 'Toshiba', 'MSI', 'Razer', 'Huawei'
    // Add more brands as needed
  ];

  const Issues = [
    'Internet service down', 'Internet New Connection'
    // Add more issues as needed
  ];

  const [selectedTypeofIssue, setTypeofIssue] = useState('');
  const [selectedClientName, setClientName] = useState('');
  const [selectedClientAddress, setClientAddress] = useState('');
  const [selectedClientCity, setClientCity] = useState('');
  const [selectedClientMobile, setClientMobile] = useState('');
  const [selectedIssueDesc, setIssueDesc] = useState('');
  const [selectedRemark, setRemark] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [selectedLaptopBrand, setSelectedLaptopBrand] = useState('');
  const [mandatoryFieldError, setMandatoryFieldError] = useState(false);

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  const saveData = async (e) => {
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

    const db = getDatabase(app);
    const newDocRef = push(ref(db, "nature/client"));
    const currentDate = formatDate(new Date());
    try {
      await set(newDocRef, {
        TypeofIssue: selectedTypeofIssue,
        ClientName: selectedClientName,
        ClientAddress: selectedClientAddress,
        ClientCity: selectedClientCity,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,
        Remark: selectedRemark,
        laptopBrand: selectedLaptopBrand,
        Status: 'created',
        createdAt: currentDate,
        updatedAt: currentDate
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
    setSelectedLaptopBrand('');
  };

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

  return (
    <>
      <Navbar />
      <div>
        <form className="formclass" onSubmit={saveData}>
          <div className="form-group">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Type of issue<span className="mandatory">*</span></label>
                <select 
                  id="inputState" 
                  className="form-control"
                  value={selectedTypeofIssue}
                  onChange={(e) => setTypeofIssue(e.target.value)}
                >
                  <option value="" disabled>Choose...</option>
                  {Issues.map(issue => (
                    <option key={issue} value={issue}>{issue}</option>
                  ))}
                </select>
              </div>
              <div className={`form-group col-md-6`}>
                <label>Client Name<span className="mandatory">*</span></label>
                <input
                  type="text"
                  value={selectedClientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="form-control"
                  maxLength="70"
                />
              </div>
            </div>
            <div className="form-row">
            <div className={`form-group col-md-6`}>
                <label>Issue Description<span className="mandatory">*</span></label>
                <textarea
                  type="text"
                  value={selectedIssueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="Describe Issue"
                  className="form-control"
                  maxLength="150"
                />
              </div>

             
              <div className="form-group col-md-6">
            <label>Address<span className="mandatory">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              value={selectedClientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter Address"
              maxLength="150"
            />
            <label>City<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedClientCity}
                onChange={(e) => setClientCity(e.target.value)}
                maxLength="70"
              />
            <label>Mobile<span className="mandatory">*</span></label>
            <input
              type="text"
              value={selectedClientMobile}
              onChange={handleMobileChange}
              placeholder="Mobile"
              className={`form-control ${isValidMobile ? '' : 'invalid'}`}
               pattern="\d{10}"
              maxLength="10"
            />
            {!isValidMobile && <p className="error-message">Please enter a 10-digit number</p>}
          
          </div>
            </div>
          </div>    
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={clearFields}>Clear</button>
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

export default AddInventoryItemInternet;

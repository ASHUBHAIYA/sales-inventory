import React, { useState } from 'react';
import app from "../firebase";
import { getDatabase, ref, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import "../App.css";
import Navbar from '../components/Navbar';
import Homepagebutton from './Homepagebutton';
import "./AddInventoryItemInternet.css";

function AddInventoryItem() {
  const navigate = useNavigate();
  
  const DeviceBrands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 
    'Samsung', 'Sony', 'Toshiba', 'MSI', 'Razer', 'Huawei'
    // Add more brands as needed
  ];

  const Issues = [
    'Laptop Repair', 'Desktop Repair', 'Printer Repair', 'Tonner Refilling'
    // Add more issues as needed
  ];

  const [selectedTypeofIssue, setTypeofIssue] = useState('');
  const [selectedClientName, setClientName] = useState('');
  const [selectedClientAddress, setClientAddress] = useState('');
  const [selectedClientCity, setClientCity] = useState('');
  const [selectedClientState, setClientState] = useState('');
  const [selectedClientPin, setClientPin] = useState('');
  const [selectedClientMobile, setClientMobile] = useState('');
  const [selectedIssueDesc, setIssueDesc] = useState('');
  const [selectedRemark, setRemark] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [selectedDeviceBrand, setSelectedDeviceBrand] = useState('');
  const [mandatoryFieldError, setMandatoryFieldError] = useState(false);
  const [selectedModel, setModel] = useState('');
  const [selectedServiceType, setServiceType] = useState('');
  const [selectedItemsReceived, setItemsReceived] = useState('');
  const [selectedDeviceCondition, setDeviceCondition] = useState('');
  



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
      !selectedClientCity || !selectedClientState || !selectedClientPin ||
      !selectedClientMobile  || !selectedDeviceBrand || 
      !selectedModel || !selectedServiceType  
      || !selectedItemsReceived || !selectedDeviceCondition
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
        ClientState: selectedClientState,
        ClientPin: selectedClientPin,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,

      Model: selectedModel,
      ServiceType: selectedServiceType  ,
      ItemsReceived : selectedItemsReceived,
      DeviceCondition : selectedDeviceCondition,

        Remark: selectedRemark,
        DeviceBrand: selectedDeviceBrand,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => {
        setShowSuccessMessage(false); // Automatically close success message after 3 seconds
      }, 3000);
      clearFields(); // Clear fields after successful save
    } catch (error) {
      setShowErrorMessage(true); // Show error message
      setTimeout(() => {
        setShowErrorMessage(false); // Automatically close error message after 3 seconds
      }, 3000);
    }
  };

  const clearFields = () => {
    setModel('');
    setServiceType('');
    setItemsReceived('');
    setDeviceCondition('');
    setTypeofIssue('');
    setClientName('');
    setClientAddress('');
    setClientCity('');
    setClientState('');
    setClientPin('');
    setClientMobile('');
    setIssueDesc('');
    setRemark('');
    setSelectedDeviceBrand('');
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
              <div className="form-group col-md-6">
            <label>Device Brand<span className="mandatory">*</span></label>
            <select
              value={selectedDeviceBrand}
              onChange={(e) => setSelectedDeviceBrand(e.target.value)}
              className="form-control"
            >
              <option value="" disabled>Select a brand</option>
              {DeviceBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
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
                <label>Model</label><span className="mandatory">*</span>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Enter Model"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="form-row">
          <div className="form-group col-md-6">
            <label>Address<span className="mandatory">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              value={selectedClientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter Address"
            />
          </div>

          <div className="form-group col-md-6">
            <label>Service Type<span className="mandatory">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              value={selectedServiceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="Type of service"
            />
          </div>
          </div>

          <div className="form-row">
          <div className="form-group col-md-6">
              <label>State<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedClientState}
                onChange={(e) => setClientState(e.target.value)}
              />
            </div>

            <div className="form-group col-md-6">
              <label>Items Received<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedItemsReceived}
                onChange={(e) => setItemsReceived(e.target.value)}
              />
            </div>   

          </div>

          <div className="form-row">
          <div className="form-group col-md-6">
              <label>City<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedClientCity}
                onChange={(e) => setClientCity(e.target.value)}
              />
            </div>

            <div className="form-group col-md-6">
              <label>Physical Device Condition<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                value={selectedDeviceCondition}
                onChange={(e) => setDeviceCondition(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group groupadjust">
            <div className="form-group col-md-6">
              <label>PinCode<span className="mandatory">*</span></label>
              <input 
                type="text" 
                className="form-control pin"
                value={selectedClientPin}
                onChange={(e) => setClientPin(e.target.value)}
              />
            </div>
          <div className={`form-group col-md-6 ${isValidMobile ? '' : 'invalid'}`}>
            <label>Mobile<span className="mandatory">*</span></label>
            <input
              type="text"
              value={selectedClientMobile}
              onChange={handleMobileChange}
              placeholder="Mobile"
              className={`form-control pin ${isValidMobile ? '' : 'invalid'}` }
            />
            {!isValidMobile && <p className="error-message">Please enter a 10-digit number</p>}
          </div>
              </div>
              <div className="form-group col-md-6">
            <label>Remark</label>
              <textarea  
                type="text" 
                className="form-control remark"
                value={selectedRemark}
                onChange={(e) => setRemark(e.target.value)}
              />
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

export default AddInventoryItem;

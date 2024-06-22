import React, { useState, useEffect } from 'react';
import app from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "./AddInventoryItemInternet.css";
function EditShopInventoryItem() {
  const navigate = useNavigate();
  const { firebaseId } = useParams();

  const [loading, setLoading] = useState(true); // Loading state

  const [selectedTypeofIssue, setTypeofIssue] = useState('');
  const [selectedClientName, setClientName] = useState('');
  const [selectedClientAddress, setClientAddress] = useState('');
  const [selectedClientCity, setClientCity] = useState('');
  const [selectedClientState, setClientState] = useState('');
  const [selectedClientPin, setClientPin] = useState('');
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
  
  const [mandatoryFieldError, setMandatoryFieldError] = useState(false);

  const DeviceBrands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 
    'Samsung', 'Sony', 'Toshiba', 'MSI', 'Razer', 'Huawei'
    // Add more brands as needed
  ];

  const Issues = [
    'Laptop Repair', 'Desktop Repair', 'Printer Repair', 'Tonner Refilling'
    // Add more issues as needed
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts

        const db = getDatabase(app);
        const dbRef = ref(db, "nature/client/" + firebaseId);
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
          const targetObject = snapshot.val();
          setTypeofIssue(targetObject.TypeofIssue || '');
          setClientName(targetObject.ClientName || '');
          setClientAddress(targetObject.ClientAddress || '');
          setClientCity(targetObject.ClientCity || '');
          setClientState(targetObject.ClientState || '');
          setClientPin(targetObject.ClientPin || '');
          setClientMobile(targetObject.ClientMobile || '');
          setIssueDesc(targetObject.IssueDesc || '');
          setRemark(targetObject.Remark || '');
          setSelectedDeviceBrand(targetObject.laptopBrand || '');
          setModel(targetObject.Model || '');
          setServiceType(targetObject.ServiceType || '');
          setItemsReceived(targetObject.ItemsReceived || '');
          setDeviceCondition(targetObject.DeviceCondition || '');
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
      !selectedClientCity || !selectedClientState || !selectedClientPin ||
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
        ClientState: selectedClientState,
        ClientPin: selectedClientPin,
        ClientMobile: selectedClientMobile,
        IssueDesc: selectedIssueDesc,
        Remark: selectedRemark,
        laptopBrand: selectedDeviceBrand,
        Model: selectedModel,
        ServiceType: selectedServiceType,
        ItemsReceived: selectedItemsReceived,
        DeviceCondition: selectedDeviceCondition
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

  if (loading) {
    return <div>Loading...</div>; // Display loading message or spinner
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

  return (
    <>
      <Navbar />

      <div className='editInv'>
      <div>
        <form className="formclass" onSubmit={overwriteData}>
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
      </div>




     
    </>
  );
}

export default EditShopInventoryItem;

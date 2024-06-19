import React, {useState} from 'react';
import app from "../firebase";
import { getDatabase, ref, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import "../App.css";

function AddInventoryItem() {

  const navigate = useNavigate();
  
  const laptopBrands = [
    'Apple',
    'Dell',
    'HP',
    'Lenovo',
    'Asus',
    'Acer',
    'Microsoft',
    'Samsung',
    'Sony',
    'Toshiba',
    'MSI',
    'Razer',
    'Huawei',
    // Add more brands as needed
  ];

  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [inputValue4, setInputValue4] = useState('');
  const [inputValue5, setInputValue5] = useState('');
  const [inputValue6, setInputValue6] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [selectedLaptopBrand, setSelectedLaptopBrand] = useState('');

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  const saveData = async () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "nature/client"));
    const currentDate = formatDate(new Date());
    try {
      await set(newDocRef, {
        clientName: inputValue1,
        clientDetail: inputValue2,
        clientMobile: inputValue3,
        clientIssue: inputValue4,
        laptopBrand: selectedLaptopBrand,
        laptopIssue: inputValue6,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      setShowSuccessMessage(true); // Show success message
      // Reset input fields after successful save (if needed)
      setInputValue1('');
      setInputValue2('');
      setInputValue3('');
      setInputValue4('');
      setInputValue5('');
      setInputValue6('');
      setSelectedLaptopBrand('');
      // Automatically close success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      setShowErrorMessage(true); // Show error message
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false); // Close success message
  };

  const closeErrorMessage = () => {
    setShowErrorMessage(false); // Close error message
  };

  const handleMobileChange = (e) => {
    const mobileNumber = e.target.value;
    setInputValue3(mobileNumber); // Update input value

    // Validate mobile number
    if (/^\d{10}$/.test(mobileNumber)) {
      setIsValidMobile(true);
      setShowErrorMessage(false); // Remove error message on valid input
    } else {
      setIsValidMobile(false);
    }
  };

  return ( 
    <div className="form-container">
      <h1>SAVE DATA</h1>
      <form className="vertical-form">
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Client Name:</label>
          <input
            type="text"
            value={inputValue1}
            onChange={(e) => setInputValue1(e.target.value)}
            placeholder="Client Name"
          />
        </div>
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Client Detail:</label>
          <input
            type="text"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
            placeholder="Client Detail"
          />
        </div>
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Client Mobile:</label>
          <input
            type="Number"
            value={inputValue3}
            onChange={handleMobileChange}
            placeholder="Client Mobile"
            className={isValidMobile ? '' : 'invalid'}
          />
          {!isValidMobile && <p className="error-message">Please enter a 10-digit number</p>}
        </div>
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Client Issue:</label>
          <input
            type="text"
            value={inputValue4}
            onChange={(e) => setInputValue4(e.target.value)}
            placeholder="Client Issue"
          />
        </div>
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Laptop Brand:</label>
          <select
            value={selectedLaptopBrand}
            onChange={(e) => setSelectedLaptopBrand(e.target.value)}
            className="select-input" style={{ width: '234px', height: '39px' }}
          >
            <option value="">Select a brand</option>
            {laptopBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className={`form-group ${isValidMobile ? '' : 'invalid'}`}>
          <label>Laptop Issue:</label>
          <input
            type="text"
            value={inputValue6}
            onChange={(e) => setInputValue6(e.target.value)}
            placeholder="Laptop Issue"
          />
        </div>
        <button type="button" onClick={saveData}>Save Data</button>
        
      </form>
      <button className='button1' onClick={ () => navigate("/view")}>View All issue</button> <br />
      <button className='button1' onClick={ () => navigate("/")}>Go to home page</button>
      {showSuccessMessage && (
        <div className="message success-message">
          <p>Data saved successfully!</p>
          <button onClick={closeSuccessMessage}>Close</button>
        </div>
      )}

      {showErrorMessage && (
        <div className="message error-message">
          <p>Failed to save data. Please try again.</p>
          <button onClick={closeErrorMessage}>Retry</button>
        </div>
      )}
    </div>
  )
}

export default AddInventoryItem
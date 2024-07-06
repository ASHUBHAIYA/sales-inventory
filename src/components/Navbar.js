import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./NavbarStyle.css";
import { MenuItems } from "./MenuItem";
import UpdateProfile from "./UpdateProfile";
import Signup from "./Signup";
import { auth } from '../firebase';
import { getDatabase, ref, get, remove } from "firebase/database";
import app from "../firebase";

function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const userEmail = auth.currentUser ? auth.currentUser.email : null;
  console.log("User Email Address" + userEmail )

  useEffect(() => {
    const fetchData = async () => {
      try {

        const db = getDatabase(app);
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

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data");
      } 
    };

    fetchData();
  }, []);


  const handleClick = () => {
    setClicked(!clicked);
  };




  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleProfileUpdate = () => {
    setShowProfileModal(true);
    setClicked(false);
  };

  const handleSignup = () => {
    setShowSignupModal(true);
    setClicked(false);
  };

  const handleCloseProfileModal = () => setShowProfileModal(false);
  const handleCloseSignupModal = () => setShowSignupModal(false);

  const handleUpdateSuccess = () => {
    setShowProfileModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
  };

  return (
    <nav className="NavbarItems">
      <h1 className="Navbar-logo">THE COMPUTER ADMIN</h1>
      
      <div className="menu-icons" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {MenuItems.map((item, index) => (
          <li key={index}>
            <Link className={item.cName} to={item.url} onClick={handleClick}>
              <i className={item.icon}></i>
              {item.title}
            </Link>
          </li>
        ))}
        
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fa-solid fa-user"></i>
          </a>
          
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <Link className="dropdown-item" onClick={handleProfileUpdate}>
                <i className="fas fa-sliders-h fa-fw"></i> Update Profile
              </Link>
            </li>
            <li>
            {isAdmin &&  <Link className="dropdown-item" onClick={handleSignup}>
                <i className="fas fa-user-plus fa-fw"></i> Add User
              </Link>}
            </li>
            <li>
              <Link className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt fa-fw"></i> Log Out
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      {/* Profile Update Modal */}
      <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateProfile onUpdateSuccess={handleUpdateSuccess} /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProfileModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={handleCloseSignupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Signup onSignupSuccess={handleSignupSuccess} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSignupModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
}

export default Navbar;

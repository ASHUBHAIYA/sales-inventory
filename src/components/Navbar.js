import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Card, Form, Alert } from "react-bootstrap";
import "./NavbarStyle.css";
import { MenuItems } from "./MenuItem";
import UpdateProfile from "./UpdateProfile"; // Assuming UpdateProfile component is in the same directory as Navbar

function Navbar() {
  const [clicked, setClicked] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // State for controlling the profile modal

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Handle error if needed
    }
  };

  const handleProfileUpdate = () => {
    setShowProfileModal(true); // Open the profile modal
    setClicked(false); // Close the menu after clicking profile update
  };

  const handleCloseProfileModal = () => setShowProfileModal(false);

  const handleUpdateSuccess = () => {
    setShowProfileModal(false); // Close the modal on success
  };

  return (
    <nav className="NavbarItems">
      <h1 className="Navbar-logo">TCA</h1>
      
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
              <Link className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sliders-h fa-fw"></i> Log Out
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
    </nav>
  );
}

export default Navbar;

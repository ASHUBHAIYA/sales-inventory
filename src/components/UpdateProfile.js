// UpdateProfile.js
import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";

function UpdateProfile({ onUpdateSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Add your update profile logic here, e.g., update password
      // Example:
      // await updateProfile({ password });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUpdateSuccess();
      }, 3000); // Close the modal after 3 seconds
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Profile updated successfully</Alert>}
      <Form.Group id="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button disabled={loading} className="w-100 mt-3" type="submit">
        Update Profile
      </Button>
    </Form>
  );
}

export default UpdateProfile;

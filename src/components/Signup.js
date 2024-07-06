// src/components/Signup.js
import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Form, Button, Card, Alert } from "react-bootstrap";
import './customStyles.css';
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../firebase";

const Signup = ({ onSignupSuccess }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const mobileRef = useRef();
  const roleRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);

      const db = getDatabase(app);
      const newDocRef = push(ref(db, "auth/client"));
      await set(newDocRef, {
        email: emailRef.current.value,
        name: nameRef.current.value,
        mobile: mobileRef.current.value,
        role: roleRef.current.value
      });

      setSuccess('Account created successfully!');
      setTimeout(() => {
        onSignupSuccess(); // Close the modal after 2 seconds
      }, 2000);
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  };

  return (
    <>
      <Card className="custom-cardSignup">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="mobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="text" ref={mobileRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Form.Group id="role">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" ref={roleRef} required>
              <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Add User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default Signup;

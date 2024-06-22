import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import App from './App'; // Example import of your main App component
import './index.css'; // Example import of global styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
const rootElement = document.getElementById("root")
const root = createRoot(rootElement)

root.render(
  <Router>
  <App/>
  </Router>
);
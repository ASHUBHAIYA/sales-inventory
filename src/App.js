import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryList from './components/InventoryList';
import AddInventoryItem from './components/AddInventoryItem';
import EditInventoryItem from './components/EditInventoryItem';
import EditShopInventoryItem from './components/EditShopInventoryItem';
import DeleteInventoryItem from './components/DeleteInventoryItem';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import './assets/styles/App.css';
import Home from './components/Home';
import AddInventoryItemInternet from './components/AddInventoryItemInternet';
import Signup from './components/Signup';
import AuthProvider from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import UpdateProfile from './components/UpdateProfile';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <AuthProvider>
        <div className="App">
        
          <Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes - Only accessible if authenticated */}
            <Route path="/" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/update-profile" element={
              <RequireAuth>
                <UpdateProfile />
              </RequireAuth>
            } />
            <Route path="/home" element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            } />
            <Route path="/view" element={
              <RequireAuth>
                <InventoryList />
              </RequireAuth>
            } />
            <Route path="/add-item" element={
              <RequireAuth>
                <AddInventoryItem />
              </RequireAuth>
            } />
            <Route path="/add-itemInternet" element={
              <RequireAuth>
                <AddInventoryItemInternet />
              </RequireAuth>
            } />
            <Route path="/delete-item" element={
              <RequireAuth>
                <DeleteInventoryItem />
              </RequireAuth>
            } />
            <Route path="/edit-item/:firebaseId" element={
              <RequireAuth>
                <EditInventoryItem />
              </RequireAuth>
            } />
            <Route path="/edit-itemShop/:firebaseId" element={
              <RequireAuth>
                <EditShopInventoryItem />
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
        </div>
    </AuthProvider>
  );
}

export default App;

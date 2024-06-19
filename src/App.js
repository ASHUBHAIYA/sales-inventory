import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryList from './components/InventoryList';
import AddInventoryItem from './components/AddInventoryItem';
import EditInventoryItem from './components/EditInventoryItem';
import DeleteInventoryItem from './components/DeleteInventoryItem';
import NotFound from './pages/NotFound';
import './assets/styles/App.css';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={ <Home/>}/>
          <Route exact path="/view" element={ <InventoryList/>}/>
          <Route path="/add-item" element={ <AddInventoryItem/>}/>
          <Route path="/delete-item" element={ <DeleteInventoryItem/>}/>
          <Route path="/edit-item/:firebaseId" element={ <EditInventoryItem/>}/>
          <Route component={NotFound} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

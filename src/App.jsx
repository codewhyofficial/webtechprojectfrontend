import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AddDevice from './pages/AddDevice';
import ViewDevices from './pages/ViewDevices';
import AssignOwnership from './pages/AssignOwnership';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-device" element={<AddDevice />} />
        <Route path="/view-devices" element={<ViewDevices />} />
        <Route path="/assign-ownership" element={<AssignOwnership />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

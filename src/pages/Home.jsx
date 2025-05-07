import React from 'react';
import Navbar from '../components/Navbar.jsx';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold text-center">Welcome to the Application</h1>
      </div>
    </div>
  );
}

export default Home;

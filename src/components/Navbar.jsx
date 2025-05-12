import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navbar() {
  const token = localStorage.getItem('jwt_token');
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/';
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80 }}
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className="text-gray-900 text-2xl font-semibold tracking-tight"
          >
            UITS
          </Link>
        </motion.div>

        <div className="space-x-6 flex items-center">
          {isAuthenticated ? (
            <>
              <AnimatedNavLink to="/profile">Profile</AnimatedNavLink>
              <AnimatedNavLink to="/add-device">Add Device</AnimatedNavLink>
              <AnimatedNavLink to="/assign-ownership">Assign Ownership</AnimatedNavLink>
              <AnimatedNavLink to="/view-devices">View Devices</AnimatedNavLink>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <AnimatedNavLink to="/login">Login</AnimatedNavLink>
              <AnimatedNavLink to="/register">Sign Up</AnimatedNavLink>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

// Reusable animated nav link
const AnimatedNavLink = ({ to, children }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
    <Link
      to={to}
      className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar;

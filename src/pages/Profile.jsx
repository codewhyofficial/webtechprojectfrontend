import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {profile ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <p>Email: {profile.email}</p>
              <p>Role: {profile.role}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

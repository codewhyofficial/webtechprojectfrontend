import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      console.log("Profile:", data);
      console.log(data.user_id)
      setProfile(data);

      // once we have profile, fetch their devices
      const viewRes = await axios.post(
        "http://localhost:8080/api/device/view",
        { user_id: data.user_id },
        { headers: { Authorization: token } }
      );

      console.log("Devices:", viewRes.data.devices);
      setDevices(viewRes.data.devices || []);
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{profile.full_name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">📧 Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-600">👤 Username</p>
              <p className="font-medium">{profile.username}</p>
            </div>
            <div>
              <p className="text-gray-600">💼 Designation</p>
              <p className="font-medium">{profile.designation}</p>
            </div>
            <div>
              <p className="text-gray-600">🔑 Role</p>
              <p className="font-medium capitalize">{profile.role}</p>
            </div>
            <div>
              <p className="text-gray-600">⚙️ Status</p>
              <p className="font-medium">
                {profile.status === 1 ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Devices Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          <h3 className="text-2xl font-semibold p-6">Your Devices</h3>
          <table className="min-w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "ID",
                  "Name",
                  "Category",
                  "Type",
                  "Serial No",
                  "Model No",
                  "Owner",
                  "Added By",
                  "Location",
                ].map((h) => (
                  <th key={h} className="px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devices.length > 0 ? (
                devices.map((d) => (
                  <tr key={d.device_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{d.device_id}</td>
                    <td className="px-4 py-2">{d.device_name}</td>
                    <td className="px-4 py-2">{d.category_name}</td>
                    <td className="px-4 py-2">{d.type_name}</td>
                    <td className="px-4 py-2">{d.serial_no}</td>
                    <td className="px-4 py-2">{d.model_no}</td>
                    <td className="px-4 py-2">{d.owner}</td>
                    <td className="px-4 py-2">{d.added_by_name}</td>
                    <td className="px-4 py-2">{d.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-6 text-gray-500">
                    No devices assigned or added by you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

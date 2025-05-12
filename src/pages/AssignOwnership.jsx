import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {motion} from "framer-motion";

export default function AssignOwnership() {
  const token = localStorage.getItem("jwt_token");

  // Dropdown data
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);

  // Form state
  const [userId, setUserId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");

  // Success / error
  const [message, setMessage] = useState(null);

  // Fetch users, locations, types on mount
  useEffect(() => {
    const headers = { Authorization: token };

    axios
      .get("http://localhost:8080/api/admin/users", { headers })
      .then((res) => setUsers(res.data.users || []))
      .catch(console.error);


    axios
      .get("http://localhost:8080/api/device/locations", { headers })
      .then((res) => setLocations(res.data || []))
      .catch(console.error);

    axios
      .get("http://localhost:8080/api/device/all-types", { headers })
      .then((res) => setTypes(res.data || []))
      .catch(console.error);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      user_id: +userId,
      start_datetime: startDatetime,
      end_datetime: endDatetime || null,
      // only include if selected
      ...(locationId && { location_id: +locationId }),
      ...(typeId && { type_id: +typeId }),
    };

    console.log("Payload:", payload);


    try {
      await axios.post(
        "http://localhost:8080/api/admin/ownership/assign",
        payload,
        { headers: { Authorization: token } }
      );
      setMessage({ type: "success", text: "Ownership assigned successfully." });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Assignment failed.",
      });
    }
  };

return (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="min-h-screen bg-white text-black px-4"
  >
    <Navbar />
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      className="max-w-2xl mx-auto mt-12 p-8 rounded-xl shadow-lg border border-black/10"
    >
      <h1 className="text-3xl font-semibold text-center mb-8">
        Assign Ownership
      </h1>

      {message && (
        <div
          className={`mb-6 p-3 rounded-md text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User */}
        <div>
          <label className="block mb-1 text-sm font-medium">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.full_name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 text-sm font-medium">Location</label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
          >
            <option value="">Any</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Device Type */}
        <div>
          <label className="block mb-1 text-sm font-medium">Device Type</label>
          <select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
          >
            <option value="">Any</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.typename}
              </option>
            ))}
          </select>
        </div>

        {/* Start DateTime */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={startDatetime}
            onChange={(e) => setStartDatetime(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* End DateTime */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={endDatetime}
            onChange={(e) => setEndDatetime(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-md bg-white transition focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-medium rounded-md transition hover:opacity-90"
        >
          Assign Ownership
        </button>
      </form>
    </motion.div>
  </motion.div>
);

}

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ViewDevices() {
  const token = localStorage.getItem("jwt_token");

  // Filter dropdown data
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Filter inputs
  const [filters, setFilters] = useState({
    category_id: "",
    type_id: "",
    user_id: "",
    owner_name: "",
    added_by: "",
    location_id: "",
  });

  // Table data
  const [devices, setDevices] = useState([]);

  // Fetch categories and locations on mount
  useEffect(() => {
    const headers = { Authorization: token };
    axios
      .get("http://localhost:8080/api/device/categories", { headers })
      .then((res) => setCategories(res.data || []));
    axios
      .get("http://localhost:8080/api/device/locations", { headers })
      .then((res) => setLocations(res.data || []));
  }, [token]);

  // Fetch types whenever category changes
  useEffect(() => {
    if (!filters.category_id) {
      setTypes([]);
      return;
    }
    const headers = { Authorization: token };
    axios
      .get(`http://localhost:8080/api/device/types/${filters.category_id}`, {
        headers,
      })
      .then((res) => setTypes(res.data || []));
  }, [filters.category_id, token]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  // Submit filters and fetch table data
  const applyFilters = async () => {
    const headers = { Authorization: token };
    const payload = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "") payload[k] = isNaN(v) ? v : +v;
    });
    try {
      const res = await axios.post(
        "http://localhost:8080/api/device/view",
        payload,
        { headers }
      );
      // <-- extract the `devices` array
      setDevices(res.data.devices || []);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">View Devices</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="category_id"
                value={filters.category_id}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block mb-1">Type</label>
              <select
                name="type_id"
                value={filters.type_id}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                disabled={!filters.category_id}
              >
                <option value="">All</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.typename}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1">Location</label>
              <select
                name="location_id"
                value={filters.location_id}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Owner Name */}
            <div>
              <label className="block mb-1">Owner Name</label>
              <input
                type="text"
                name="owner_name"
                value={filters.owner_name}
                onChange={handleFilterChange}
                placeholder="e.g. Alice"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Owner (user_id) */}
            <div>
              <label className="block mb-1">Owner User ID</label>
              <input
                type="number"
                name="user_id"
                value={filters.user_id}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Added By */}
            <div>
              <label className="block mb-1">Added By (User ID)</label>
              <input
                type="number"
                name="added_by"
                value={filters.added_by}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto bg-white rounded shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Serial No</th>
                <th className="px-4 py-2">Model No</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Added By</th>
                <th className="px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.device_id} className="border-t">
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
              ))}
              {devices.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No devices found.
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

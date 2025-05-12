import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          full_name: fullName,
          designation,
          username,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      {/* flex-1 to fill remaining space */}
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-black text-center">
            Create an Account
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-gray-100 border border-gray-300 text-black rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-800">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-800">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Project Manager"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-800">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="jane_doe1"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-800">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2 bg-black text-white rounded text-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

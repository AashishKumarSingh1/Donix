"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  

  const handleLogin = async () => {
    if (!email || !password || !role) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.error || "Unknown error"}`);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000); // Redirect to `/` after 3 seconds
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      Cookies.set("token", data.token, {
        expires: 7,
        path: "/",
        sameSite: "strict",
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", JSON.stringify(role));
      toast.success("Login successful!");
      if (role === "user") {
        window.location.href = "/dashboard";
      } else if (role === "hospital") {
        window.location.href = "/hospitalDashboard";
      } else if (role === "admin") {
        window.location.href = "/AdminDashboard";
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Redirecting to the home page...");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000); 
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
  className="min-h-screen flex justify-center items-center p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white transition-colors duration-300"
>
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  <div
    className="max-w-lg w-full mx-auto p-6 shadow-2xl rounded-xl border mt-10 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 transition-colors duration-300"
  >
    <h2
      className="text-2xl sm:text-3xl font-bold w-full flex items-center justify-center gap-3 mb-6 text-blue-400"
    >
      <FaSignInAlt className="text-3xl" /> Login
    </h2>

    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white border-gray-600 placeholder-gray-400"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white border-gray-600 placeholder-gray-400"
          placeholder="Enter your password"
        />
      </div>

      <div>
  <label htmlFor="role" className="block text-sm font-medium mb-1 text-gray-300">
    Role
  </label>
  <select
    id="role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white border-gray-600"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
    <option value="hospital">Hospital</option>
  </select>
</div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-6 py-3 text-lg font-semibold flex justify-center items-center gap-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Login"}
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default Login;
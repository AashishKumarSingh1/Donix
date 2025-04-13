"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const { resolvedTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/register/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      Cookies.set("token", data.token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 md:p-8 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar aria-label="Notification container" />
      <div className="max-w-lg w-full p-6 shadow-2xl rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-3 text-lg font-semibold flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
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

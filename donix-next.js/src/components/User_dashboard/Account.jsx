/* eslint-disable @typescript-eslint/no-require-imports */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaDribbble,
  FaInstagram,
  FaLinkedin,
  FaGoogle,
} from "react-icons/fa";
import Cookies from "js-cookie";



export default function Account() {
  const [darkMode] = useState(true); 
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    

    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return; // Early return without setting loading
        }

        const response = await fetch("https://donix-org-aman.onrender.com/getDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data.user);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    const fetchBlogs = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return; // Early return without setting loading
        }

        const response = await fetch("https://donix-org-aman.onrender.com/getUserBlogs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch blogs.");
        }

        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    const fetchData = async () => {
      setLoading(true); // Set loading before fetching
      await Promise.all([fetchUserDetails(), fetchBlogs()]);
      setLoading(false); // Set loading to false after both fetches
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div
      className={`p-6 min-h-screen relative ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Profile Card */}
      <div
        className={`w-full max-w-xl mx-auto rounded-lg shadow-lg p-6 cursor-pointer overflow-hidden border-l-4 transition-all mb-8 ${
          darkMode
            ? "bg-gray-800 border-purple-500 text-white"
            : "bg-white border-purple-300 hover:border-purple-700 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyzK2fuK3gDNJMRMKGHwHXfyqd6X1pL4lAxg&s"
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full mb-3"
          />
          <span className="bg-gray-500 text-white px-4 py-1 rounded text-sm">
            Registered User
          </span>
          <h5 className="text-lg font-semibold mt-2">
            {userDetails?.fullName || "User"}
          </h5>
          <span className="text-gray-500 dark:text-gray-400">
            Organ Donor/Recipient
          </span>
          <p
            className={`text-center text-sm mt-3 px-6 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Thank you for joining our platform. Together, we can make a
            difference by saving lives and sharing inspiring stories.
          </p>
          <ul className="flex space-x-4 mt-4 text-purple-600 dark:text-purple-400">
            <li>
              <FaFacebook className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaDribbble className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaInstagram className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaLinkedin className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaGoogle className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
          </ul>
          <div className="mt-4 flex space-x-3">
            <a href={`mailto:${userDetails?.email}`}>
              <button className="border border-purple-700 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-md hover:bg-purple-700 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition">
                Message
              </button>
            </a>
            <a href={`tel:${userDetails?.phoneNo}`}>
              <button className="bg-purple-700 text-white dark:bg-purple-400 dark:text-gray-900 px-4 py-2 rounded-md hover:bg-purple-800 dark:hover:bg-purple-500 transition">
                Contact
              </button>
            </a>
          </div>
        </div>
      </div>
      {/* Blog List */}
      <div>
        <h2 className="text-3xl font-extrabold mb-8 text-center backdrop-blur-lg bg-white/10 dark:bg-gray-800/10 p-4 rounded-lg">
          My Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className={`backdrop-blur-lg border border-white/30 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white/20 text-gray-700"
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                  <p className="text-sm mb-4">{blog.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs opacity-70">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-sm hover:underline text-purple-600 dark:text-purple-400">
                    Read More
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No blogs found. Start sharing your stories today!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
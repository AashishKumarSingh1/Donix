"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineStar, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Image from "next/image";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [darkMode] = useState(true); 

  useEffect(() => {
  

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) throw new Error("No token found");

        const response = await axios.post(
          "https://donix-org-aman.onrender.com/getDetails",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data.user);
        toast.success("User details fetched successfully!");
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode ? "1" : "0"); // Save preference to localStorage
      return newMode;
    });
  };

  if (loading) {
    return (
          <div className="flex justify-center items-center min-h-screen">
            <Image
              src="/Laoder_animation.gif"
              alt="Loading..."
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        );
  }


    return (
        <div className={`p-6 min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <AiOutlineStar size={20} />
                    <span>Dashboards / Overview</span>
                </div>
                <div className="flex items-center gap-4">
                    <AiOutlineSearch size={20} />
                    {darkMode ? (
                        <HiOutlineSun size={24} onClick={() => setDarkMode(false)} className="cursor-pointer" />
                    ) : (
                        <HiOutlineMoon size={24} onClick={() => setDarkMode(true)} className="cursor-pointer" />
                    )}
                    <AiOutlineBell size={20} />
                    <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                </div>
            </header>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-semibold">Hello, {userDetails?.fullName || "User"} 👋</h1>
                </div>
                <div className="bg-gray-300 w-24 h-24 rounded-lg flex justify-center items-center">
                    <p>QR Code</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                    { label: 'Total Donation', value: 0 },
                    { label: 'Transplant Done', value: 0 },
                    { label: 'Blogs Written', value: 15 },
                    { label: 'Profile Visits', value: 2318 },
                    { label: 'Events Organized', value: 156 },
                    { label: 'Donor Matches', value: 8 }
                ].map((item, index) => (
                    <div key={index} className="bg-blue-100 rounded-lg p-4">
                        <h2 className="text-gray-600">{item.label}</h2>
                        <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
                <ul className="space-y-2">
                    <li className="text-gray-600">✔️ Successfully organized a blood donation camp.</li>
                    <li className="text-gray-600">✔️ Matched a kidney donor with recipient.</li>
                    <li className="text-gray-600">✔️ Published a new blog on organ donation awareness.</li>
                </ul>
            </div>

            
        </div>
    );
};

export default Profile;
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { IoBagAddOutline } from "react-icons/io5";
import { RiFindReplaceLine } from "react-icons/ri";
import { VscLayoutActivitybarLeft } from "react-icons/vsc";
import { AiOutlineAccountBook } from "react-icons/ai";
import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineWorkHistory } from "react-icons/md";
import { IoMdLogOut, IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import Profile from "../../components/User_dashboard/Profile";
import Add from "../../components/User_dashboard/Add";
import Find from "../../components/User_dashboard/Find";
import Activity from "../../components/User_dashboard/Activity";
import ChatApp from "../../components/User_dashboard/Chat";
import Account from "../../components/User_dashboard/Account";
import { Task } from "../../components/User_dashboard/Task";
import { LogoutModal } from "../../components/User_dashboard/LogOutModal";
import Image from "next/image";
import RealTimeChatApp from "../../components/User_dashboard/RealTimeChat";
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("Profile");
  const [userDetails, setUserDetails] = useState(null);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Retrieve dark mode preference
    setDarkMode(localStorage.getItem("darkMode") === "1");

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

   if (loading)
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

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/Login";
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Profile":
        return <Profile />;
      case "Add Organ":
        return <Add />;
      case "Find Organ":
        return <Find />;
      case "Activities":
        return <Activity />;
      case "Account":
        return <Account />;
      case "Chat":
        return <RealTimeChatApp />;
      case "Task":
        return <Task/>;
      case "Logout":
        return null;
      default:
        return <Profile />;
    }
  };

return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 z-2 left-0 w-64 h-screen p-6 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gray-800 text-gray-200 md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-400"
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoMdClose className="text-2xl" />
        </button>
  
        {/* Profile Section */}
        <div
          className="flex items-center gap-3 mb-6 cursor-pointer hover:text-blue-500"
          onClick={() => {
            setActiveContent("Profile"); // Set active content to "Profile"
            setIsSidebarOpen(false); // Close the sidebar on mobile
          }}
        >
          <FaUserCircle className="text-3xl" />
          <div>
            <span className="text-lg block">{userDetails?.fullName || "User"}</span>
            <span className="text-sm">{JSON.parse(localStorage.getItem("role") || '"Role"')}</span>
          </div>
        </div>
        <hr className="my-4" />
  
        {/* Navigation */}
        <ul className="space-y-4">
          {[
            { icon: IoBagAddOutline, text: "Add Organ", key: "Add Organ" },
            { icon: RiFindReplaceLine, text: "Find Organ", key: "Find Organ" },
            { icon: VscLayoutActivitybarLeft, text: "Activity", key: "Activities" },
            { icon: AiOutlineAccountBook, text: "Account", key: "Account" },
            { icon: IoIosChatbubbles, text: "Chat", key: "Chat" },
          ].map(({ icon: Icon, text, key }) => (
            <li
              key={key}
              onClick={() => {
                setActiveContent(key);
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
            >
              <Icon className="text-2xl" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
  
        {/* Additional Options */}
        <ul className="space-y-4">
          {[
            { icon: MdOutlineWorkHistory, text: "Task", key: "Task" },
            {
              icon: IoMdLogOut,
              text: "Logout",
              key: "Logout",
              action: () => setLogoutModalVisible(true),
            },
          ].map(({ icon: Icon, text, key, action }) => (
            <li
              key={key}
              onClick={action || (() => {
                setActiveContent(key);
                setIsSidebarOpen(false);
              })}
              className="flex items-center gap-3 cursor-pointer hover:text-red-500"
            >
              <Icon className="text-2xl" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <div className="fixed top-0 left-0 w-full h-9 z-50 flex justify-start md:hidden bg-gray-800 text-white">
          <button
            className="p-2 text-gray-300 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      )}
  
      {/* Main Content */}
      <div className="ml-0 md:ml-64 sm:ml-12 flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
  
      {/* Logout Modal */}
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Dashboard;

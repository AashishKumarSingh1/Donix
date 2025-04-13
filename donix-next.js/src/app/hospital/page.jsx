"use client"
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoBagAddOutline } from "react-icons/io5";
import { RiFindReplaceLine } from "react-icons/ri";
import { VscLayoutActivitybarLeft } from "react-icons/vsc";
import { AiOutlineAccountBook } from "react-icons/ai";
import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineWorkHistory } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { MdDomainVerification } from "react-icons/md";
import Profile from "../../components/hospital/Profile"
import OrganMatching from "../../components/hospital/OrganMatching"
import Documentation from "../../components/hospital/Documentation"
import StaffManagement from "../../components/hospital/StaffManagement"

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("Today Tasks");

  // Content based on the active state
  const renderContent = () => {
    switch (activeContent) {
      case "Profile":
        return <div className="text-gray-600"><Profile/></div>;
      case "Manage Organs":
        return <div className="text-gray-600"><OrganMatching/></div>;
      case "Documentation":
        return <div className="text-gray-600"><Documentation/></div>;
    
        return <div className="text-gray-600">Activities Content</div>;
      case "Staff Management":
        return <div className="text-gray-600"><StaffManagement/></div>;
      case "Chat":
        return <div className="text-gray-600">Chat </div>;
      case "History":
        return <div className="text-gray-600">History Content</div>;
      case "Verification":
        return <div className="text-gray-600">Verification Content</div>;
      case "Logout":
        return <div className="text-gray-600">Logout Content</div>;
      default:
        return (
          <div>
            <div className="text-2xl text-gray-700 font-bold mb-6">
              Today Tasks
            </div>
            <div className="flex justify-evenly border-b border-gray-300 pb-5 mb-5">
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                All
              </label>
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                Important
              </label>
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                Notes
              </label>
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                Meetings
              </label>
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                Family
              </label>
              <label className="cursor-pointer font-medium text-gray-500 border-b-2 border-transparent hover:border-blue-500">
                <input type="radio" name="nav" className="hidden" />
                Work
              </label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-4" />
                <div className="text-gray-600">Sample Task 1</div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-4" />
                <div className="text-gray-600">Sample Task 2</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex justify-between w-screen h-screen bg-white  rounded-none shadow-none overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-900 w-[260px] border-r border-gray-300 dark:border-gray-700 relative">
        <div className="p-8">
          <ul className="space-y-4">
            <li
              onClick={() => setActiveContent("Profile")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <FaUserCircle />
              </i>
              <span className="text-lg">Mediversal</span>
            </li>
            <li
              onClick={() => setActiveContent("Manage Organs")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <IoBagAddOutline />
              </i>
              <span className="text-lg">Manage Organs</span>
            </li>
            <li
              onClick={() => setActiveContent("Documentation")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <RiFindReplaceLine />
              </i>
              <span className="text-lg">Documentation</span>
            </li>
            <li
              onClick={() => setActiveContent("Staff Management")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <VscLayoutActivitybarLeft />
              </i>
              <span className="text-lg">Staff Management</span>
            </li>
            <li
              onClick={() => setActiveContent("Account")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <AiOutlineAccountBook />
              </i>
              <span className="text-lg">Account</span>
            </li>
            <li
              onClick={() => setActiveContent("Chat")}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-500 dark:hover:text-blue-400 transition duration-300 cursor-pointer"
            >
              <i className="text-3xl text-gray-500 dark:text-gray-400">
                <IoIosChatbubbles />
              </i>
              <span className="text-lg">Chat</span>
            </li>
          </ul>
          <hr className="my-6 border-gray-300 dark:border-gray-700" />
          <ul className="space-y-4">
            <li
              onClick={() => setActiveContent("History")}
              className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-500 transition duration-300 cursor-pointer"
            >
              <i className="text-2xl">
                <MdOutlineWorkHistory />
              </i>
              <span>History</span>
            </li>
            <li
              onClick={() => setActiveContent("Verification")}
              className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-green-500 transition duration-300 cursor-pointer"
            >
              <i className="text-2xl">
                <MdDomainVerification />
              </i>
              <span>Verification</span>
            </li>
            <li
              onClick={() => setActiveContent("Logout")}
              className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-600 transition duration-300 cursor-pointer"
            >
              <i className="text-2xl">
                <IoMdLogOut />
              </i>
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;

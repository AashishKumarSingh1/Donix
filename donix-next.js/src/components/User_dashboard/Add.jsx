"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarCheck, FaDownload } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode] = useState(true); 
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [organName, setOrganName] = useState("");
  const [formLink, setFormLink] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {

    const fetchHospitals = async () => {
      try {
        const response = await fetch("https://donix-org-aman.onrender.com/allHospitals");
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        const data = await response.json();
        setHospitals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserName = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("You must be logged in.");
          return;
        }

        const response = await axios.post(
          "https://donix-org-aman.onrender.com/getDetails",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserName(response.data.user.fullName);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      }
    };

    fetchHospitals();
    fetchUserName();
  }, []);

  const handleBookAppointment = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("You must be logged in to book an appointment.");
        return;
      }

      const response = await axios.post(
        "https://donix-org-aman.onrender.com/bookAppointment",
        {
          name: userName,
          organ: organName,
          formLink: formLink,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
            hospitalid: selectedHospitalId,
          },
        }
      );

      if (response.status === 201) {
        toast.success(
          "Appointment booked successfully! You will be verified soon via email."
        );
        setOverlayVisible(false); // Close the overlay
        setOrganName(""); // Reset input fields
        setFormLink("");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

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
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div
      className={`overflow-x-auto shadow-md rounded-lg mt-5 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr
            className={`${darkMode ? "bg-blue-700" : "bg-blue-600"} text-white`}
          >
            <th className="border border-gray-300 p-3">Hospital Details</th>
            <th className="border border-gray-300 p-3 hidden md:table-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr
              key={hospital._id}
              className={`border border-gray-300 ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-900"
              } flex flex-col md:table-row`}
            >
              <td className="p-4">
                <div className="font-bold text-lg text-blue-800">
                  {hospital.hospitalName}
                </div>
                <div
                  className={`text-gray-700 ${darkMode ? "text-white" : ""}`}
                >
                  📍 {hospital.city}, {hospital.state}, {hospital.country}
                </div>
                <div
                  className={`text-gray-700 ${darkMode ? "text-white" : ""}`}
                >
                  📞 {hospital.contactNumber}
                </div>
                <div
                  className={`text-gray-700 ${darkMode ? "text-white" : ""}`}
                >
                  🏅 {hospital.accreditation}
                </div>
                <div className="mt-2">
                  <strong>Specialization:</strong> Philothamy
                </div>
                <div>
                  <strong>Services:</strong> Luara ka
                </div>
                <div>
                  <strong>Staff:</strong> Doctors:10, Nurses:12, Support: 13
                </div>
                <div>
                  <strong>Capacity:</strong> Beds: 11, ICU:12, Ventilators: 13
                </div>
                <div>
                  <strong>Emergency Contact:</strong> {hospital.email}
                </div>
                <div>
                  <strong>Website:</strong>{" "}
                  <a
                    href={hospital.website}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    amanm.com
                  </a>
                            
                </div>
                {/* Actions for Small Screens */}
                <div className="mt-4 flex flex-col space-y-4 md:hidden">
                  <button
                    onClick={() => {
                      setSelectedHospitalId(hospital._id);
                      setOverlayVisible(true);
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg w-full justify-center ${
                      darkMode
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "bg-blue-500 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FaCalendarCheck className="mr-2" /> Book Appointment
                  </button>
                  <button
                    className={`flex items-center px-4 py-2 rounded-lg w-full justify-center ${
                      darkMode
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : "bg-green-500 text-white hover:bg-green-700"
                    }`}
                  >
                    <FaDownload className="mr-2" /> Download Form
                  </button>
                </div>
              </td>

              <td className="p-3 hidden md:flex flex-col items-center space-y-4">
                <button
                  onClick={() => {
                    setSelectedHospitalId(hospital._id);
                    setOverlayVisible(true);
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg w-full md:w-auto justify-center ${
                    darkMode
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-500 text-white hover:bg-blue-700"
                  }`}
                >
                  <FaCalendarCheck className="mr-2" /> Book Appointment
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-lg w-full md:w-auto justify-center ${
                    darkMode
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-green-500 text-white hover:bg-green-700"
                  }`}
                >
                  <FaDownload className="mr-2" /> Download Form
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Overlay for Booking Appointment */}
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">Book Appointment</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Organ Name</label>
              <input
                type="text"
                value={organName}
                onChange={(e) => setOrganName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organ name"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Form Link</label>
              <input
                type="text"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter form link"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setOverlayVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;

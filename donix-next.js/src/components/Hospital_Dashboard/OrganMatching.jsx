import React, { useState, useEffect } from "react";
import { AiOutlineStar, AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import { HiOutlineSun, HiOutlineMoon, HiOutlineTruck } from "react-icons/hi";
import Cookies from "js-cookie";
import axios from "axios";

const OrganDonationTab = () => {
  const [darkMode] = useState(true); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transports, setTransports] = useState([]);
  const [requests, setrequests] = useState([]);

  useEffect(() => {
    fetchPendingVerifications();
    fetchPendingRequests();
    fetchTransportData();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.get(
        "https://donix-org-aman.onrender.com/getHospitalAppointments",
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.get(
        "https://donix-org-aman.onrender.com/getAllRequestedOrgan",
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setrequests(response.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportData = async () => {
    // Mock transport data
    setTransports([
      {
        id: 1,
        organ: "Heart",
        from: "Hospital A",
        to: "Hospital B",
        status: "On Time",
        timeRemaining: "2h",
        delay: false,
      },
      {
        id: 2,
        organ: "Kidney",
        from: "Clinic X",
        to: "Hospital Y",
        status: "Delayed",
        timeRemaining: "5h",
        delay: true,
      },
    ]);
  };

  const approveAppointment = async (appointmentId) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.put(
        `https://donix-org-aman.onrender.com/approveAppointment/${appointmentId}`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setAppointments(
          appointments.filter((app) => app._id !== appointmentId)
        );
        alert("Appointment approved successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve appointment.");
    }
  };


  const approveRequest = async (requestId) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await axios.put(
        `https://donix-org-aman.onrender.com/approveRequest/${requestId}`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setrequests(
          requests.filter((app) => app._id !== requestId)
        );
        alert("request approved successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve request.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className={`flex flex-col h-screen w-full ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Fixed Header */}
      <header
        className={`p-6 ${
          darkMode ? "bg-gray-900" : "bg-white"
        } border-b border-gray-200 sticky top-0 z-10 w-full`}
      >
        <div className="flex justify-between items-center w-full max-w-full">
          <div className="flex items-center gap-2">
            <AiOutlineStar size={20} />
            <span>Dashboards / Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <AiOutlineSearch size={20} />
            {darkMode ? (
              <HiOutlineSun
                size={24}
                onClick={() => setDarkMode(false)}
                className="cursor-pointer"
              />
            ) : (
              <HiOutlineMoon
                size={24}
                onClick={() => setDarkMode(true)}
                className="cursor-pointer"
              />
            )}
            <AiOutlineBell size={20} />
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Full-width Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full p-6">
          <div className="w-full space-y-6">
            {/* Pending Donations Section */}
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h1 className="text-1xl font-semibold mb-6 bg-gradient-to-r from-gray-700 to-gray-600 text-white p-4 rounded-lg shadow-md text-center">
                Pending Appointment Verifications
              </h1>
              {appointments.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">
                  No pending verifications found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-500 text-white text-left">
                        <th className="p-4">Name</th>
                        <th className="p-4">Organ</th>
                        <th className="p-4">Form Link</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment._id}
                          className="border-b hover:bg-gray-100 transition"
                        >
                          <td className="p-4">{appointment.name}</td>
                          <td className="p-4">{appointment.organ}</td>
                          <td className="p-4">
                            <a
                              href={appointment.formLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Form
                            </a>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() =>
                                approveAppointment(appointment._id)
                              }
                              className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>


            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h1 className="text-1xl font-semibold mb-6 bg-gradient-to-r from-gray-700 to-gray-600 text-white p-4 rounded-lg shadow-md text-center">
                Pending organ Requests
              </h1>
              {requests.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">
                  No pending organ Requests found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-500 text-white text-left">
                        <th className="p-4">userId</th>
                        <th className="p-4">Organ</th>
                        
                        <th className="p-4">RequestedAt</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr
                          key={request._id}
                          className="border-b hover:bg-gray-100 transition"
                        >
                          <td className="p-4">{request.userId}</td>
                          <td className="p-4">{request.organ}</td>
                          <td className="p-4">{request.requestedAt}</td>
                          
                          <td className="p-4">
                            <button
                              onClick={() =>
                                approveRequest(request._id)
                              }
                              className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Donor-Recipient Matching Section */}
            <div
              className={`p-6 rounded-lg shadow-lg w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                Donor-Recipient Matching
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <h3 className="font-semibold mb-2">Available Organs</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Kidney (O+)</span>
                      <span className="text-sm text-gray-500">2 available</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Liver (AB-)</span>
                      <span className="text-sm text-gray-500">1 available</span>
                    </li>
                  </ul>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-green-50"
                  }`}
                >
                  <h3 className="font-semibold mb-2">Waiting Recipients</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Kidney (O+)</span>
                      <span className="text-sm text-gray-500">
                        Priority: High
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Liver (AB-)</span>
                      <span className="text-sm text-gray-500">
                        Priority: Critical
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Run Matching Algorithm
                </button>
              </div>
            </div>

            {/* Real-Time Organ Tracking Section */}
            <div
              className={`p-6 rounded-lg shadow-lg w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HiOutlineTruck className="text-blue-500" />
                Real-Time Organ Tracking
              </h2>
              <div className="space-y-4">
                {transports.map((transport) => (
                  <div
                    key={transport.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      transport.delay
                        ? "border-red-500 bg-red-50"
                        : "border-green-500 bg-green-50"
                    } ${darkMode ? "bg-gray-700" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {transport.organ} Transport
                        </h3>
                        <p className="text-sm">
                          {transport.from} → {transport.to}
                        </p>
                      </div>
                      <span
                        className={`text-sm ${
                          transport.delay ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {transport.status}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Time remaining: {transport.timeRemaining}
                      </span>
                      {transport.delay && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                          Emergency Delay
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View All Transports
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganDonationTab;

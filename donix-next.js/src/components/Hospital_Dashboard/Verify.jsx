import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Verify = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [admins, setAdmins] = useState([]); // State to store admin details
  const [showAdmins, setShowAdmins] = useState(false); // State to toggle admin table visibility

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "1");

    const fetchHospitalDetails = async () => {
      try {
        const token = Cookies.get("token"); // Retrieve token from localStorage
        if (!token) throw new Error("No token found");

        const response = await fetch(
          "https://donix-org-aman.onrender.com/getHospitalDetails",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setIsVerified(data.hospital.isVerified); // Set verification status
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("https://donix-org-aman.onrender.com/allAdmins", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAdmins(data.admins); // Set admin details
      setShowAdmins(true); // Show the admin table
    } catch (error) {
      console.error("Error fetching admins:", error.message);
    }
  };

  if (loading) {
    return (
      <div className={darkMode ? "text-white" : "text-black"}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div className={darkMode ? "text-red-400" : "text-red-600"}>
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`p-6 flex flex-col items-center justify-center space-y-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {isVerified ? (
        <div className="flex items-center space-x-2 text-green-500 font-semibold text-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>Verified</span>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-red-500 font-semibold text-lg">
            <span>Verification Pending</span>
          </div>
          <button
            onClick={fetchAdmins}
            className={`px-5 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition-transform duration-200 ease-in-out ${
              darkMode
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            }`}
          >
            Raise Issue to Superadmin
          </button>
        </div>
      )}

      {showAdmins && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Superadmins</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {admin.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                  <button
  onClick={() => window.location.href = `mailto:${admin.email}`}
  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200 ease-in-out"
>
  Contact {admin.email}
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

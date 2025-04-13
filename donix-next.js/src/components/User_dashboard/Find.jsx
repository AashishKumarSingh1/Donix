import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";


const Find = () => {
  const [organs, setOrgans] = useState([]);
  const [expandedHospital, setExpandedHospital] = useState(null); 
  const [selectedOrgan, setSelectedOrgan] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [darkMode] = useState(true); 

  // Fetch organ data from the API
  useEffect(() => {
    const fetchOrgans = async () => {
      try {
        const response = await fetch("https://donix-org-aman.onrender.com/fetchOrgan");
        if (!response.ok) {
          throw new Error("Failed to fetch organ data");
        }
        const data = await response.json();
        setOrgans(data.organs);
      } catch (error) {
        console.error("Error fetching organ data:", error);
      }
    };

    fetchOrgans();
  }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Small screen if width <= 768px
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle dropdown for a specific hospital
  const toggleDropdown = (hospitalName) => {
    setExpandedHospital((prev) =>
      prev === hospitalName ? null : hospitalName
    );
  };

  // Handle organ selection
  const handleOrganClick = (organ) => {
    setSelectedOrgan(organ);
    setShowModal(true);
  };

  // Handle request submission
  const handleRequest = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("User not logged in!");
        return;
      }
      if (!selectedOrgan) {
        alert("No organ selected!");
        return;
      }

      const response = await fetch("https://donix-org-aman.onrender.com/requestOrgan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospitalId: selectedOrgan.hospitalId,
          organ: selectedOrgan.organ,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request organ");
      }

      alert("Organ request submitted successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error requesting organ:", error);
      alert("Failed to request organ. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 p-3">Hospital Name</th>
            <th className="border border-gray-300 p-3">Organs Available</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...new Set(organs.map((item) => item.hospitalName))].map(
            (hospitalName) => (
              <React.Fragment key={hospitalName}>
                <tr>
                  <td className="border border-gray-300 p-3">{hospitalName}</td>
                  <td className="border border-gray-300 p-3">
                    {organs
                      .filter((item) => item.hospitalName === hospitalName)
                      .map((item) => item.organ)
                      .join(", ")}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => toggleDropdown(hospitalName)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      {expandedHospital === hospitalName ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedHospital === hospitalName && (
                  <tr>
                    <td colSpan={3} className="border border-gray-300 p-3">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3">
                              Organ
                            </th>
                            <th className="border border-gray-300 p-3">
                              Count
                            </th>
                            <th className="border border-gray-300 p-3">
                              Blood Group
                            </th>
                            <th className="border border-gray-300 p-3">
                              Price (₹)
                            </th>
                            {!isSmallScreen && (
                              <th className="border border-gray-300 p-3">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {organs
                            .filter(
                              (item) => item.hospitalName === hospitalName
                            )
                            .map((item) => (
                              <tr
                                key={item._id}
                                onClick={() =>
                                  isSmallScreen && handleOrganClick(item)
                                }
                                className={`${
                                  isSmallScreen
                                    ? "cursor-pointer hover:bg-gray-100"
                                    : ""
                                }`}
                              >
                                <td className="border border-gray-300 p-3">
                                  {item.organ}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {item.count}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {item.bloodGroup}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  ₹{item.price}
                                </td>
                                {!isSmallScreen && (
                                  <td className="border border-gray-300 p-3 text-center">
                                    <button
                                      onClick={() => handleOrganClick(item)}
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                      Request
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>

      {/* Modal Overlay */}
      {showModal && selectedOrgan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Request Organ
            </h2>
            <p className="mb-6 text-center text-black">
              Are you sure you want to request the organ{" "}
              <strong>{selectedOrgan.organ}</strong> from{" "}
              <strong>{selectedOrgan.hospitalName}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Find;